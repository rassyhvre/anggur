import tensorflow as tf
import os

print(f"TensorFlow Version: {tf.__version__}")

# Path models
model_filter_path = "model terbaru/model_grape.keras"        # Model filter BARU
model_disease_path = "model terbaru/model_anggur_final.keras" # Model penyakit (jika ada .keras)

output_dir = "model terbaru"
os.makedirs(output_dir, exist_ok=True)

# Convert model filter baru
try:
    print(f"Mengonversi {model_filter_path}...")
    filter_model = tf.keras.models.load_model(model_filter_path)
    filter_model.summary()
    converter = tf.lite.TFLiteConverter.from_keras_model(filter_model)
    tflite_filter = converter.convert()
    output_path = os.path.join(output_dir, "model_grape.tflite")
    with open(output_path, "wb") as f:
        f.write(tflite_filter)
    print(f"Berhasil mengonversi model filter daun ke {output_path}")
except Exception as e:
    print(f"Gagal mengonversi model filter daun: {e}")

# Convert model penyakit (opsional - jika ada file .keras-nya)
if os.path.exists(model_disease_path):
    try:
        print(f"\nMengonversi {model_disease_path}...")
        disease_model = tf.keras.models.load_model(model_disease_path)
        disease_model.summary()
        converter = tf.lite.TFLiteConverter.from_keras_model(disease_model)
        tflite_disease = converter.convert()
        output_path = os.path.join(output_dir, "model_anggur_final.tflite")
        with open(output_path, "wb") as f:
            f.write(tflite_disease)
        print(f"Berhasil mengonversi model deteksi penyakit ke {output_path}")
    except Exception as e:
        print(f"Gagal mengonversi model deteksi penyakit: {e}")
else:
    print(f"\n[INFO] Model penyakit .keras tidak ditemukan di {model_disease_path}")
    print("[INFO] Model penyakit .tflite sudah tersedia, tidak perlu konversi ulang.")

print("\nSelesai. File TFLite ada di folder: model terbaru/")
