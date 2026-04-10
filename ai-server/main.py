from fastapi import FastAPI, UploadFile, File
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
from tensorflow import keras
from PIL import Image
import numpy as np
import io

app = FastAPI()

# ==================== MODEL FILTER DAUN ====================
# Model binary classifier: kelas 0 = bukan_daun_anggur, kelas 1 = daun_anggur
filter_model = keras.models.load_model("model/model_filter_daun.keras")

FILTER_CLASS_NAMES = ["bukan_daun_anggur", "daun_anggur"]
FILTER_THRESHOLD = 0.7  # Minimum confidence untuk dianggap daun anggur

# ==================== MODEL DETEKSI PENYAKIT ====================
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

disease_model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(4, activation="softmax")
])

disease_model.load_weights("model/model.weights.h5")

class_names = [
    "Black Measles",
    "Black Rot",
    "Healthy",
    "Isariopsis Leaf Spot"
]

# ==================== HELPER ====================
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# ==================== ENDPOINTS ====================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    processed_image = preprocess_image(image_bytes)

    # Step 1: Filter — apakah gambar ini daun anggur?
    filter_prediction = filter_model.predict(processed_image)

    # DEBUG: cetak raw output model filter
    print(f"[DEBUG FILTER] Raw output shape: {filter_prediction.shape}")
    print(f"[DEBUG FILTER] Raw output value: {filter_prediction[0]}")

    # Handle baik sigmoid (1 output) maupun softmax (2 output)
    if filter_prediction.shape[-1] == 1:
        # Sigmoid: output = probabilitas kelas 0 (bukan_daun_anggur)
        # Jadi probabilitas daun anggur = 1 - output
        raw_value = float(filter_prediction[0][0])
        grape_leaf_confidence = 1.0 - raw_value
    else:
        # Softmax: index 1 = daun anggur
        grape_leaf_confidence = float(filter_prediction[0][1])

    is_grape_leaf = grape_leaf_confidence >= FILTER_THRESHOLD

    print(f"[DEBUG FILTER] grape_leaf_confidence: {grape_leaf_confidence}")
    print(f"[DEBUG FILTER] is_grape_leaf: {is_grape_leaf} (threshold: {FILTER_THRESHOLD})")

    if not is_grape_leaf:
        return {
            "is_grape_leaf": False,
            "filter_confidence": grape_leaf_confidence,
            "message": "Gambar yang diunggah bukan daun anggur. Silakan unggah foto daun anggur untuk deteksi penyakit."
        }

    # Step 2: Deteksi penyakit (hanya jika lolos filter)
    prediction = disease_model.predict(processed_image)
    predicted_index = int(np.argmax(prediction[0]))
    confidence = float(np.max(prediction[0]))

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
    processed_image = preprocess_image(image_bytes)

    filter_prediction = filter_model.predict(processed_image)

    # Handle baik sigmoid (1 output) maupun softmax (2 output)
    if filter_prediction.shape[-1] == 1:
        # Sigmoid: output = probabilitas bukan_daun_anggur, jadi dibalik
        grape_leaf_confidence = 1.0 - float(filter_prediction[0][0])
    else:
        grape_leaf_confidence = float(filter_prediction[0][1])

    is_grape_leaf = grape_leaf_confidence >= FILTER_THRESHOLD

    return {
        "is_grape_leaf": is_grape_leaf,
        "filter_confidence": grape_leaf_confidence,
        "predicted_class": "daun_anggur" if is_grape_leaf else "bukan_daun_anggur",
    }