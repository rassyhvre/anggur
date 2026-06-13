import os
import io
import base64
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import tensorflow as tf

# Inisialisasi FastAPI
app = FastAPI(title="KingScan AI Server", description="Keras Classification - Grape Leaf Disease Detection")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model", "super_leaf_model.keras")
model = None

# Harus sesuai dengan output node model.
# ["Black Rot", "ESCA", "Healthy", "Leaf Blight", "bukan_daun_anggur"]
CLASS_NAMES = ["Black Rot", "ESCA", "Healthy", "Leaf Blight", "bukan_daun_anggur"]

# Kelas VALID penyakit daun anggur (exclude bukan_daun_anggur)
VALID_DISEASE_CLASSES = {"Black Rot", "ESCA", "Healthy", "Leaf Blight"}

# Mapping nama kelas model -> nama yang dipakai di database/frontend
CLASS_NAME_MAP = {
    "ESCA": "Black Measles",
    "Leaf Blight": "Isariopsis Leaf Spot",
}


# ======= Background Removal =======
rembg_session = None

def get_rembg_session():
    """Lazy-load rembg session"""
    global rembg_session
    if rembg_session is None:
        try:
            from rembg import new_session
            print("[INFO] Loading rembg session (u2net)...")
            rembg_session = new_session("u2net")
            print("[OK] rembg session loaded.")
        except ImportError:
            print("[WARN] rembg not installed. Background removal disabled.")
            rembg_session = "DISABLED"
        except Exception as e:
            print(f"[WARN] Failed to load rembg: {e}. Background removal disabled.")
            rembg_session = "DISABLED"
    return rembg_session


def remove_background(image: Image.Image) -> Image.Image:
    """Remove background from image using rembg. Returns RGB image with white background."""
    session = get_rembg_session()
    if session == "DISABLED":
        return image

    try:
        from rembg import remove
        # Convert to bytes for rembg
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        input_bytes = buf.getvalue()

        # Remove background - returns RGBA image bytes
        output_bytes = remove(input_bytes, session=session)
        result_rgba = Image.open(io.BytesIO(output_bytes)).convert("RGBA")

        # Composite onto white background for model input
        white_bg = Image.new("RGBA", result_rgba.size, (255, 255, 255, 255))
        composited = Image.alpha_composite(white_bg, result_rgba)
        return composited.convert("RGB")
    except Exception as e:
        print(f"[WARN] Background removal failed: {e}. Using original image.")
        return image


def get_model():
    """Lazy-load Keras classification model on first request"""
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model tidak ditemukan di: {MODEL_PATH}. "
                f"Pastikan file super_leaf_model.keras sudah ditaruh di folder 'model/'."
            )
        print(f"[INFO] Loading Keras Classification model from: {MODEL_PATH}")
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"[OK] Model loaded. Expected classes: {CLASS_NAMES}")
    return model


def map_class_name(raw_name: str) -> str:
    return CLASS_NAME_MAP.get(raw_name, raw_name)


# ======= Grad-CAM Implementation =======

def find_last_conv_layer(keras_model):
    """Find the last convolutional layer in the model for Grad-CAM."""
    for layer in reversed(keras_model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
        # Also check inside nested models (e.g., functional API wrappers)
        if hasattr(layer, 'layers'):
            for sub_layer in reversed(layer.layers):
                if isinstance(sub_layer, tf.keras.layers.Conv2D):
                    return sub_layer.name
    return None


def generate_gradcam(keras_model, img_array, predicted_class_idx):
    """
    Generate Grad-CAM heatmap for the predicted class.
    Returns the heatmap as a numpy array (0-255, uint8) or None on failure.
    """
    try:
        last_conv_layer_name = find_last_conv_layer(keras_model)
        if last_conv_layer_name is None:
            print("[WARN] No Conv2D layer found for Grad-CAM.")
            return None

        print(f"[Grad-CAM] Using conv layer: {last_conv_layer_name}")

        # Locate the conv layer (may be nested inside a sub-model)
        last_conv_layer = None
        for layer in keras_model.layers:
            if layer.name == last_conv_layer_name:
                last_conv_layer = layer
                break
            if hasattr(layer, 'layers'):
                for sub_layer in layer.layers:
                    if sub_layer.name == last_conv_layer_name:
                        last_conv_layer = sub_layer
                        break
                if last_conv_layer is not None:
                    break

        if last_conv_layer is None:
            print("[WARN] Could not locate conv layer for Grad-CAM.")
            return None

        # Build grad model that outputs conv activations + predictions
        grad_model = tf.keras.Model(
            inputs=keras_model.input,
            outputs=[last_conv_layer.output, keras_model.output]
        )

        # Compute gradients
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            loss = predictions[:, predicted_class_idx]

        grads = tape.gradient(loss, conv_outputs)
        if grads is None:
            print("[WARN] Gradients are None. Grad-CAM failed.")
            return None

        # Global average pooling of gradients
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # Weight the conv outputs by the pooled gradients
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # ReLU and normalize
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
        heatmap = heatmap.numpy()

        # Resize to 224x224
        heatmap_resized = np.uint8(255 * heatmap)
        heatmap_img = Image.fromarray(heatmap_resized).resize((224, 224), Image.BILINEAR)
        return np.array(heatmap_img)

    except Exception as e:
        print(f"[WARN] Grad-CAM generation failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def create_gradcam_overlay(original_image: Image.Image, heatmap: np.ndarray, alpha=0.4) -> str:
    """
    Overlay Grad-CAM heatmap on the original image.
    Returns base64 encoded PNG string.
    """
    import matplotlib
    matplotlib.use('Agg')

    heatmap_normalized = heatmap.astype(np.float32) / 255.0
    colormap = matplotlib.colormaps['jet']
    heatmap_colored = np.uint8(colormap(heatmap_normalized)[:, :, :3] * 255)

    original_resized = original_image.resize((224, 224)).convert("RGB")
    original_array = np.array(original_resized)

    overlay = np.uint8(original_array * (1 - alpha) + heatmap_colored * alpha)

    overlay_img = Image.fromarray(overlay)
    buf = io.BytesIO()
    overlay_img.save(buf, format="PNG", optimize=True)
    buf.seek(0)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def calculate_health_percentage(valid_predictions):
    """
    Calculate health percentage based on the Healthy class probability.
    """
    healthy_confidence = 0.0
    for pred in valid_predictions:
        if pred["penyakit_raw"] == "Healthy":
            healthy_confidence = pred["confidence"]
            break
    return round(healthy_confidence * 100, 1)


@app.get("/")
def root():
    return {"status": "ok", "message": "KingScan AI Server (Keras Classification) berjalan"}


@app.get("/health")
def health():
    loaded = model is not None
    return {
        "status": "ok",
        "model_loaded": loaded,
        "model_path": MODEL_PATH,
        "classes": CLASS_NAMES if loaded else None,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        keras_model = get_model()
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Gagal memuat model: {str(e)}"},
        )

    try:
        # Load the image
        image_bytes = await file.read()
        original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # ====== STEP 1: Background Removal Preprocessing ======
        print("[PREDICT] Step 1: Removing background...")
        processed_image = remove_background(original_image)
        print("[PREDICT] Background removal complete.")

        # ====== STEP 2: Prepare image for model ======
        image_resized = processed_image.resize((224, 224))
        img_array = np.array(image_resized, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # Inisialisasi model prediksi
        preds = keras_model.predict(img_array, verbose=0)
        raw_probs = preds[0].tolist()

        if raw_probs is None or len(raw_probs) == 0:
            return JSONResponse(
                status_code=500,
                content={"success": False, "message": "Prediksi gagal."},
            )

        # ===============================================================
        # Ambil HANYA kelas penyakit valid (exclude bukan_daun_anggur)
        # Lalu renormalisasi agar totalnya = 1.0
        # ===============================================================
        valid_predictions = []
        total_valid_prob = 0.0

        bukan_idx = CLASS_NAMES.index("bukan_daun_anggur")
        bukan_prob = raw_probs[bukan_idx]
        
        # Logika "Bukan Daun Anggur" jika prediksi tertingginya "bukan_daun_anggur"
        best_overall_idx = int(np.argmax(raw_probs))
        if best_overall_idx == bukan_idx or bukan_prob > 0.5:
            return JSONResponse(
                status_code=200,
                content={
                    "is_grape_leaf": False,
                    "filter_confidence": round(float(bukan_prob), 4),
                    "message": "Objek terdeteksi bukan daun anggur",
                },
            )

        for idx, prob in enumerate(raw_probs):
            class_name = CLASS_NAMES[idx]
            if class_name in VALID_DISEASE_CLASSES:
                valid_predictions.append({
                    "class_id": idx,
                    "penyakit_raw": class_name,
                    "penyakit": map_class_name(class_name),
                    "raw_prob": prob,
                })
                total_valid_prob += prob

        # Renormalisasi confidence hanya dari kelas valid
        for pred in valid_predictions:
            if total_valid_prob > 0:
                pred["confidence"] = round(pred["raw_prob"] / total_valid_prob, 4)
            else:
                pred["confidence"] = round(1.0 / len(valid_predictions), 4)

        valid_predictions.sort(key=lambda x: x["confidence"], reverse=True)

        best = valid_predictions[0] if valid_predictions else None

        # Log
        print(f"[PREDICT] bukan_prob={bukan_prob:.4f} | valid_total={total_valid_prob:.6f}")
        if best:
            print(f"[PREDICT] Best: {best['penyakit']} (renorm={best['confidence']:.4f}, raw={best['raw_prob']:.6f})")
        for p in valid_predictions:
            print(f"  - {p['penyakit']:25s}: renorm={p['confidence']:.4f} | raw={p['raw_prob']:.6f}")

        if not best:
            return JSONResponse(
                status_code=200,
                content={
                    "is_grape_leaf": False,
                    "filter_confidence": 0.0,
                    "message": "Gagal mengklasifikasi gambar.",
                },
            )

        # ====== STEP 3: Generate Grad-CAM Visualization ======
        print("[PREDICT] Step 3: Generating Grad-CAM visualization...")
        gradcam_base64 = None
        try:
            heatmap = generate_gradcam(keras_model, img_array, best["class_id"])
            if heatmap is not None:
                gradcam_base64 = create_gradcam_overlay(processed_image, heatmap)
                print("[PREDICT] Grad-CAM generated successfully.")
            else:
                print("[PREDICT] Grad-CAM heatmap was None, skipping overlay.")
        except Exception as e:
            print(f"[PREDICT] Grad-CAM failed: {e}")

        # ====== STEP 4: Calculate Health Percentage ======
        health_percentage = calculate_health_percentage(valid_predictions)
        print(f"[PREDICT] Health percentage: {health_percentage}%")

        # ===============================================================
        # Return hasil — confidence + Grad-CAM + Health %
        # ===============================================================
        return JSONResponse(
            status_code=200,
            content={
                "is_grape_leaf": True,
                "filter_confidence": round(float(best["confidence"]), 4),
                "penyakit": best["penyakit"],
                "confidence": round(float(best["confidence"]), 4),
                "health_percentage": health_percentage,
                "gradcam_image": gradcam_base64,
                "total_predictions": len(valid_predictions),
                "all_predictions": [
                    {"penyakit": p["penyakit"], "confidence": float(p["confidence"])}
                    for p in valid_predictions
                ],
                "message": "Deteksi berhasil",
            },
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"},
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
