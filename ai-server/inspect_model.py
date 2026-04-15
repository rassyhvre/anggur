import zipfile, json

z = zipfile.ZipFile("model terbaru/model_grape.keras", "r")
config = json.loads(z.read("config.json"))
layers = config["config"]["layers"]
print(f"Total layers: {len(layers)}")
for i, l in enumerate(layers):
    name = l["config"].get("name", "")
    cls = l["class_name"]
    print(f"  {i}: {cls} ({name})")

# Check saved keras version
try:
    metadata = json.loads(z.read("metadata.json"))
    print(f"\nKeras version used to save: {metadata.get('keras_version', 'unknown')}")
except:
    print("\nNo metadata.json found")

z.close()
