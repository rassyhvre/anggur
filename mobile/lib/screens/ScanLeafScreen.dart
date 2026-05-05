import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:image/image.dart' as img;

class ScanLeafScreen extends StatefulWidget {
  const ScanLeafScreen({super.key});

  @override
  State<ScanLeafScreen> createState() => _ScanLeafScreenState();
}

class _ScanLeafScreenState extends State<ScanLeafScreen> {
  File? _imageFile;
  bool _isLoading = false;
  String _result = '';
  double _confidence = 0.0;
  
  // Array label kelas sesuai output model softmax
  final List<String> _labels = ['Black Rot', 'ESCA', 'Healthy', 'Leaf Blight', 'bukan_daun_anggur'];
  Interpreter? _interpreter;

  @override
  void initState() {
    super.initState();
    _loadModel();
  }

  Future<void> _loadModel() async {
    try {
      _interpreter = await Interpreter.fromAsset('assets/super_disease_sensor.tflite');
      debugPrint('Model loaded successfully');
    } catch (e) {
      debugPrint('Failed to load model: $e');
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    final pickedFile = await ImagePicker().pickImage(source: source);
    if (pickedFile != null) {
      await _cropImage(File(pickedFile.path));
    }
  }

  Future<void> _cropImage(File image) async {
    final croppedFile = await ImageCropper().cropImage(
      sourcePath: image.path,
      aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1), // Kunci rasio 1:1
      uiSettings: [
        AndroidUiSettings(
            toolbarTitle: 'Crop Gambar Daun',
            toolbarColor: Colors.green[700],
            toolbarWidgetColor: Colors.white,
            initAspectRatio: CropAspectRatioPreset.square,
            lockAspectRatio: true, // Wajib dikunci agar tidak distorsi
        ),
        IOSUiSettings(
          title: 'Crop Gambar Daun',
          aspectRatioLockEnabled: true,
          resetAspectRatioEnabled: false,
        ),
      ],
    );

    if (croppedFile != null) {
      setState(() {
        _imageFile = File(croppedFile.path);
        _isLoading = true;
        _result = '';
        _confidence = 0.0;
      });
      await _runInference(_imageFile!);
    }
  }

  Future<void> _runInference(File image) async {
    if (_interpreter == null) {
      debugPrint('Interpreter is not initialized');
      setState(() {
        _isLoading = false;
      });
      return;
    }

    try {
      // 1. Baca dan Resize Gambar
      final imageBytes = await image.readAsBytes();
      img.Image? decodedImage = img.decodeImage(imageBytes);
      if (decodedImage == null) {
        throw Exception("Failed to decode image");
      }

      // Resize ke 224x224
      img.Image resizedImage = img.copyResize(decodedImage, width: 224, height: 224);

      // 2. Preprocess ke Float32 format [1, 224, 224, 3]
      // Normalisasi nilai piksel (0 - 255) dibagi 255.0 menjadi (0.0 - 1.0)
      var input = List.generate(
        1,
        (i) => List.generate(
          224,
          (y) => List.generate(
            224,
            (x) {
              final pixel = resizedImage.getPixel(x, y);
              return [
                pixel.r.toDouble() / 255.0,
                pixel.g.toDouble() / 255.0,
                pixel.b.toDouble() / 255.0,
              ];
            },
          ),
        ),
      );

      // 3. Siapkan Output Tensor [1, 5]
      var output = List.generate(1, (i) => List.filled(5, 0.0));

      // 4. Run Inference
      _interpreter!.run(input, output);

      // 5. Cari Nilai Tertinggi dari array output softmax
      List<double> probabilities = output[0];
      int maxIndex = 0;
      double maxConfidence = probabilities[0];
      for (int i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > maxConfidence) {
          maxConfidence = probabilities[i];
          maxIndex = i;
        }
      }

      setState(() {
        _isLoading = false;
        _confidence = maxConfidence;
        _result = _labels[maxIndex];
      });
    } catch (e) {
      debugPrint('Error running inference: $e');
      setState(() {
        _isLoading = false;
        _result = 'Error memproses gambar';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Deteksi Penyakit Anggur'),
        backgroundColor: Colors.green[700],
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text(
              'Deteksi Cerdas Penyakit Daun',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Ambil gambar atau pilih dari galeri untuk menganalisis kesehatan daun anggur Anda.',
              style: TextStyle(fontSize: 14, color: Colors.black54),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),

            // Placeholder/Image View
            Container(
              height: 300,
              width: 300,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.green[300]!, width: 2, strokeAlign: BorderSide.strokeAlignOutside),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    spreadRadius: 2,
                    offset: const Offset(0, 4),
                  )
                ]
              ),
              child: _imageFile != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(18),
                      child: Image.file(_imageFile!, fit: BoxFit.cover),
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.energy_savings_leaf_outlined, size: 80, color: Colors.green[200]),
                        const SizedBox(height: 16),
                        Text('Belum ada gambar', style: TextStyle(color: Colors.grey[500])),
                      ],
                    ),
            ),
            const SizedBox(height: 30),

            // Loading Indicator
            if (_isLoading)
              const Column(
                children: [
                  CircularProgressIndicator(color: Colors.green),
                  SizedBox(height: 16),
                  Text('AI sedang menganalisis gambar...'),
                ],
              )
            
            // Result View
            else if (_result.isNotEmpty)
              Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.green[200]!),
                    ),
                    child: Text(
                      '$_result (Akurasi: ${(_confidence * 100).toStringAsFixed(1)}%)',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[800],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Peringatan jika Confidence di bawah 50%
                  if (_confidence < 0.5)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.orange[50],
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.orange[200]!),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.warning_amber_rounded, color: Colors.orange[800]),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Text(
                              'Gambar kurang jelas, silakan foto ulang',
                              style: TextStyle(color: Colors.orange[800], fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            
            const SizedBox(height: 40),

            // Action Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _pickImage(ImageSource.camera),
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Kamera'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Colors.green[700],
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _pickImage(ImageSource.gallery),
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Galeri'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.green[700],
                      elevation: 0,
                      side: BorderSide(color: Colors.green[700]!),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _interpreter?.close();
    super.dispose();
  }
}
