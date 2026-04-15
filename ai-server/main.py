from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
from PIL import Image
import numpy as np
import io

app = FastAPI()

# ==================== MODEL FILTER DAUN (TFLite) ====================
# Model filter BARU (model_grape) — Sigmoid, 1 output
# Output mendekati 0 = daun anggur, mendekati 1 = BUKAN daun anggur
# Preprocessing: raw pixel [0-255], TANPA normalisasi
filter_interpreter = tf.lite.Interpreter(model_path="model terbaru/model_grape.tflite")
filter_interpreter.allocate_tensors()
filter_input_details = filter_interpreter.get_input_details()
filter_output_details = filter_interpreter.get_output_details()
print(f"[INIT] Filter model loaded: input={filter_input_details[0]['shape']}, output={filter_output_details[0]['shape']}")

FILTER_THRESHOLD = 0.5  # Jika output < 0.5 = daun anggur

# ==================== MODEL DETEKSI PENYAKIT (TFLite) ====================
disease_interpreter = tf.lite.Interpreter(model_path="model terbaru/model_anggur_final.tflite")
disease_interpreter.allocate_tensors()
disease_input_details = disease_interpreter.get_input_details()
disease_output_details = disease_interpreter.get_output_details()
print(f"[INIT] Disease model loaded: input={disease_input_details[0]['shape']}, output={disease_output_details[0]['shape']}")

class_names = [
    "Black Rot",
    "Black Measles",
    "Isariopsis Leaf Spot",
    "Healthy"
]

# ==================== HELPER ====================
def preprocess_for_filter(image_bytes):
    """Preprocess untuk model filter: normalized [0, 1]."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image, dtype=np.float32) / 255.0  # [0, 1] normalization
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def preprocess_for_disease(image_bytes):
    """Preprocess untuk model penyakit: normalized [0, 1]."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image, dtype=np.float32) / 255.0  # [0, 1]
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# ==================== ENDPOINTS ====================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Step 1: Filter — apakah gambar ini daun anggur?
    filter_input = preprocess_for_filter(image_bytes)
    filter_interpreter.set_tensor(filter_input_details[0]['index'], filter_input)
    filter_interpreter.invoke()
    filter_output = filter_interpreter.get_tensor(filter_output_details[0]['index'])

    raw_value = float(filter_output[0][0])
    # Output mendekati 0 = daun anggur, mendekati 1 = bukan daun anggur
    # grape_leaf_confidence = 1 - raw_value (dibalik agar mendekati 1 = daun anggur)
    grape_leaf_confidence = 1.0 - raw_value
    is_grape_leaf = grape_leaf_confidence >= FILTER_THRESHOLD

    print(f"[DEBUG FILTER] raw_value: {raw_value:.4f}, grape_leaf_confidence: {grape_leaf_confidence:.4f}, is_grape_leaf: {is_grape_leaf}")

    if not is_grape_leaf:
        return {
            "is_grape_leaf": False,
            "filter_confidence": grape_leaf_confidence,
            "message": "Gambar yang diunggah bukan daun anggur. Silakan unggah foto daun anggur untuk deteksi penyakit."
        }

    # Step 2: Deteksi penyakit
    disease_input = preprocess_for_disease(image_bytes)
    disease_interpreter.set_tensor(disease_input_details[0]['index'], disease_input)
    disease_interpreter.invoke()
    disease_output = disease_interpreter.get_tensor(disease_output_details[0]['index'])

    predicted_index = int(np.argmax(disease_output[0]))
    confidence = float(np.max(disease_output[0]))

    return {
        "is_grape_leaf": True,
        "filter_confidence": grape_leaf_confidence,
        "penyakit": class_names[predicted_index],
        "confidence": confidence
    }

@app.post("/filter")
async def filter_leaf(file: UploadFile = File(...)):
    """Endpoint khusus untuk testing filter saja."""
    image_bytes = await file.read()
    filter_input = preprocess_for_filter(image_bytes)
    
    filter_interpreter.set_tensor(filter_input_details[0]['index'], filter_input)
    filter_interpreter.invoke()
    filter_output = filter_interpreter.get_tensor(filter_output_details[0]['index'])

    raw_value = float(filter_output[0][0])
    grape_leaf_confidence = 1.0 - raw_value
    is_grape_leaf = grape_leaf_confidence >= FILTER_THRESHOLD

    return {
        "is_grape_leaf": is_grape_leaf,
        "filter_confidence": grape_leaf_confidence,
        "predicted_class": "daun_anggur" if is_grape_leaf else "bukan_daun_anggur",
    }