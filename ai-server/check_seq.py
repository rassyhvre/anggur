import zipfile, json

z = zipfile.ZipFile('model terbaru/model_grape.keras', 'r')
config = json.loads(z.read('config.json'))
layers = config['config']['layers']

print('Layers inside Sequential block (Data Augmentation):')
for l in layers:
    if l['class_name'] == 'Sequential':
        for subl in l['config']['layers']:
            print(f"  - {subl['class_name']}")
z.close()
