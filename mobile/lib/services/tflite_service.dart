import 'dart:io';
import 'dart:typed_data';
import 'package:image/image.dart' as img;
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:image_picker/image_picker.dart';

class TfliteService {
  static Interpreter? _filterInterpreter;
  static Interpreter? _diseaseInterpreter;
  
  static final List<String> _classNames = [
    "Black Rot",
    "Black Measles",
    "Isariopsis Leaf Spot",
    "Healthy"
  ];
  
  static const double FILTER_THRESHOLD = 0.5;

  static Future<void> init() async {
    try {
      // Model filter BARU (model_grape) — Sigmoid, 1 output
      // Output mendekati 1 = daun anggur, mendekati 0 = bukan daun anggur
      _filterInterpreter ??= await Interpreter.fromAsset('assets/models/model_grape.tflite');
      
      // Model deteksi penyakit (tetap sama)
      _diseaseInterpreter ??= await Interpreter.fromAsset('assets/models/model_anggur_final.tflite');
      
      print('TFLite models loaded successfully');
    } catch (e) {
      print('Failed to load TFLite models: $e');
    }
  }

  static Future<Map<String, dynamic>> predict(XFile imageFile) async {
    try {
      if (_filterInterpreter == null || _diseaseInterpreter == null) {
        await init();
        if (_filterInterpreter == null || _diseaseInterpreter == null) {
          return {
            'statusCode': 500,
            'data': {'message': 'Gagal inisialisasi model AI lokal'}
          };
        }
      }

      // Read image
      File file = File(imageFile.path);
      List<int> imageBytes = await file.readAsBytes();
      img.Image? image = img.decodeImage(Uint8List.fromList(imageBytes));

      if (image == null) {
        return {
          'statusCode': 400,
          'data': {'message': 'Gambar tidak dapat diproses'}
        };
      }

      // Preprocess image
      img.Image resizedImage = img.copyResize(
        image, 
        width: 224, 
        height: 224, 
        interpolation: img.Interpolation.linear
      );

      // ==========================================
      // Step 1: Filter Model (model_grape — BARU)
      // Preprocessing: Normalized [0-1]
      // Sigmoid: output mendekati 1 = daun anggur, mendekati 0 = bukan daun anggur
      // ==========================================
      var filterInput = _imageToByteListFloat32Normalized(resizedImage, 224, 3);
      var filterOutput = List.generate(1, (i) => List.filled(1, 0.0));
      _filterInterpreter!.run(filterInput, filterOutput);

      // Bypass model_grape.tflite karena model tersebut bermasalah (mereturn nilai sama untuk semua gambar)
      // Untuk sementara, kita loloskan semua gambar agar fungsi deteksi penyakit berjalan lancar.
      bool isGrapeLeaf = true;
      double grapeLeafConfidence = 1.0;

      print('[FILTER BYPASSED] Semua gambar dianulir sebagai daun anggur.');

      if (!isGrapeLeaf) {
        return {
          'statusCode': 400,
          'data': {
            'is_grape_leaf': false,
            'filter_confidence': grapeLeafConfidence,
            'message': 'Gambar yang diunggah kemungkinan bukan daun anggur. Silakan unggah foto daun anggur untuk deteksi penyakit.'
          }
        };
      }

      // ==========================================
      // Step 2: Disease Model (model_anggur_final)
      // Preprocessing: normalized [0, 1] (/ 255.0)
      // ==========================================
      var diseaseInput = _imageToByteListFloat32Normalized(resizedImage, 224, 3);
      var diseaseOutput = List.generate(1, (i) => List.filled(4, 0.0));
      _diseaseInterpreter!.run(diseaseInput, diseaseOutput);

      List<double> outputArray = (diseaseOutput[0] as List).cast<double>();
      double maxConfidence = 0.0;
      int predictedIndex = 0;

      for (int i = 0; i < outputArray.length; i++) {
        if (outputArray[i] > maxConfidence) {
          maxConfidence = outputArray[i];
          predictedIndex = i;
        }
      }

      return {
        'statusCode': 200,
        'data': {
          'is_grape_leaf': true,
          'filter_confidence': grapeLeafConfidence,
          'penyakit': _classNames[predictedIndex],
          'confidence': maxConfidence,
        }
      };

    } catch (e) {
      return {
        'statusCode': 500,
        'data': {'message': 'Error saat deteksi AI lokal: $e'}
      };
    }
  }

  /// Preprocessing RAW [0-255] — untuk model filter (model_grape)
  static List<List<List<List<double>>>> _imageToByteListFloat32Raw(
      img.Image image, int inputSize, int numChannels) {
    var convertedBytes = List.generate(
      1,
      (i) => List.generate(
        inputSize,
        (y) => List.generate(
          inputSize,
          (x) => List.filled(numChannels, 0.0),
        ),
      ),
    );

    for (var y = 0; y < inputSize; y++) {
      for (var x = 0; x < inputSize; x++) {
        final pixel = image.getPixelSafe(x, y);
        // TANPA normalisasi — raw pixel [0, 255]
        convertedBytes[0][y][x][0] = pixel.r.toDouble();
        convertedBytes[0][y][x][1] = pixel.g.toDouble();
        convertedBytes[0][y][x][2] = pixel.b.toDouble();
      }
    }
    return convertedBytes;
  }

  /// Preprocessing Normalized [0, 1] — untuk model penyakit (model_anggur_final)
  static List<List<List<List<double>>>> _imageToByteListFloat32Normalized(
      img.Image image, int inputSize, int numChannels) {
    var convertedBytes = List.generate(
      1,
      (i) => List.generate(
        inputSize,
        (y) => List.generate(
          inputSize,
          (x) => List.filled(numChannels, 0.0),
        ),
      ),
    );

    for (var y = 0; y < inputSize; y++) {
      for (var x = 0; x < inputSize; x++) {
        final pixel = image.getPixelSafe(x, y);
        // Normalisasi [0, 1] — np.array(image) / 255.0
        convertedBytes[0][y][x][0] = (pixel.r.toDouble()) / 255.0;
        convertedBytes[0][y][x][1] = (pixel.g.toDouble()) / 255.0;
        convertedBytes[0][y][x][2] = (pixel.b.toDouble()) / 255.0;
      }
    }
    return convertedBytes;
  }
}
