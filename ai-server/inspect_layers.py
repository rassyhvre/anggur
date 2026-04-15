import zipfile, json

z = zipfile.ZipFile("model terbaru/model_grape.keras", "r")
config = json.loads(z.read("config.json"))
layers = config["config"]["layers"]

for l in layers:
    if l["class_name"] == "Dense":
        c = l["config"]
        units = c.get("units")
        activation = c.get("activation")
        print(f"Dense: units={units}, activation={activation}")
    if l["class_name"] == "Dropout":
        c = l["config"]
        rate = c.get("rate")
        print(f"Dropout: rate={rate}")
    if l["class_name"] == "BatchNormalization":
        print("BatchNormalization")

z.close()
