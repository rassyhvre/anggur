import os
import io
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
        print(f"[✓] Model loaded. Expected classes: {CLASS_NAMES}")
    return model


def map_class_name(raw_name: str) -> str:
    return CLASS_NAME_MAP.get(raw_name, raw_name)


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
        # Load and preprocess the image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize((224, 224))
        
        img_array = np.array(image, dtype=np.float32)
        # Expand dimension manually as Keras models expect a batch dimension (1, 224, 224, 3)
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

        # ===============================================================
        # Return hasil — confidence sudah direnormalisasi
        # ===============================================================
        return JSONResponse(
            status_code=200,
            content={
                "is_grape_leaf": True,
                "filter_confidence": round(float(best["confidence"]), 4),
                "penyakit": best["penyakit"],
                "confidence": round(float(best["confidence"]), 4),
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
