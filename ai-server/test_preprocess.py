"""
Test model_grape.tflite dengan berbagai preprocessing
untuk menemukan yang menghasilkan output bervariasi.
"""
import tensorflow as tf
import numpy as np
from PIL import Image
import os

print("Loading TFLite model...")
interp = tf.lite.Interpreter('model terbaru/model_grape.tflite')
interp.allocate_tensors()
inp = interp.get_input_details()[0]
out = interp.get_output_details()[0]
print(f"Input: {inp['shape']}, dtype: {inp['dtype']}")
print(f"Output: {out['shape']}, dtype: {out['dtype']}")

def predict(image_array):
    interp.set_tensor(inp['index'], image_array.astype(np.float32))
    interp.invoke()
    return interp.get_tensor(out['index'])[0][0]

# Test gambar sintetis
black = np.zeros((1, 224, 224, 3), dtype=np.float32)
white_255 = np.ones((1, 224, 224, 3), dtype=np.float32) * 255.0
white_1 = np.ones((1, 224, 224, 3), dtype=np.float32)
mid_127 = np.ones((1, 224, 224, 3), dtype=np.float32) * 127.5
random_img = np.random.rand(1, 224, 224, 3).astype(np.float32)

print("\n=== Test tanpa preprocessing (raw values) ===")
print(f"  Black [0]:        {predict(black):.6f}")
print(f"  White [255]:      {predict(white_255):.6f}")
print(f"  Mid [127.5]:      {predict(mid_127):.6f}")
print(f"  Random [0-1]:     {predict(random_img):.6f}")

print("\n=== Test preprocessing /255.0 [0, 1] ===")
print(f"  Black:            {predict(black / 255.0):.6f}")
print(f"  White:            {predict(white_255 / 255.0):.6f}")
print(f"  Mid:              {predict(mid_127 / 255.0):.6f}")
print(f"  Random:           {predict(random_img):.6f}")

print("\n=== Test preprocessing /127.5 - 1.0 [-1, 1] ===")
print(f"  Black:            {predict(black / 127.5 - 1.0):.6f}")
print(f"  White:            {predict(white_255 / 127.5 - 1.0):.6f}")
print(f"  Mid:              {predict(mid_127 / 127.5 - 1.0):.6f}")
print(f"  Random [scaled]:  {predict(random_img * 255 / 127.5 - 1.0):.6f}")

# Test gambar hijau (warna daun) vs gambar merah/biru
green = np.zeros((1, 224, 224, 3), dtype=np.float32)
green[..., 1] = 200.0  # channel hijau tinggi
red = np.zeros((1, 224, 224, 3), dtype=np.float32)
red[..., 0] = 200.0    # channel merah tinggi

print("\n=== Test warna spesifik (raw 0-255) ===")
print(f"  Hijau [0,200,0]:  {predict(green):.6f}")
print(f"  Merah [200,0,0]:  {predict(red):.6f}")

print("\n=== Test warna spesifik (/255.0) ===")
print(f"  Hijau [0,200,0]:  {predict(green / 255.0):.6f}")
print(f"  Merah [200,0,0]:  {predict(red / 255.0):.6f}")

print("\n=== Test warna spesifik (/127.5 - 1.0) ===")
print(f"  Hijau [0,200,0]:  {predict(green / 127.5 - 1.0):.6f}")
print(f"  Merah [200,0,0]:  {predict(red / 127.5 - 1.0):.6f}")
