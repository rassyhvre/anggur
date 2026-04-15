import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io';
import '../providers/deteksi_provider.dart';
import '../models/deteksi_result_model.dart';
import '../services/api_service.dart';
import '../services/tflite_service.dart';
import '../providers/auth_provider.dart';
import 'auth/login_page.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  static const double minConfidence = 0.6;
  bool _isLoading = false;
  XFile? _selectedImage;
  final ImagePicker _imagePicker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const SizedBox(height: 20),
            if (_selectedImage != null)
              Container(
                width: double.infinity,
                height: 250,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF16A34A), width: 2),
                ),
                child: kIsWeb
                    ? Image.network(_selectedImage!.path, fit: BoxFit.cover)
                    : Image.file(File(_selectedImage!.path), fit: BoxFit.cover),
              )
            else
              Container(
                width: double.infinity,
                height: 250,
                decoration: BoxDecoration(
                  color: const Color(0xFF16A34A).withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF16A34A), width: 2),
                ),
                child: const Icon(
                  Icons.image_not_supported,
                  size: 80,
                  color: Color(0xFF16A34A),
                ),
              ),
            const SizedBox(height: 24),
            const Text(
              'Deteksi Penyakit Tanaman',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              _selectedImage != null
                  ? 'Foto tanaman sudah siap untuk dianalisis'
                  : 'Gunakan kamera untuk mengambil foto tanaman dan AI kami akan menganalisis penyakit yang mungkin ada',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: _isLoading ? null : _scanFromCamera,
                icon: const Icon(Icons.camera_alt),
                label: const Text('Ambil Foto Kamera'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF16A34A),
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: Colors.grey,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: OutlinedButton.icon(
                onPressed: _isLoading ? null : _scanFromGallery,
                icon: const Icon(Icons.image),
                label: const Text('Pilih dari Galeri'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF16A34A),
                  side: const BorderSide(color: Color(0xFF16A34A), width: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            if (_selectedImage != null)
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: _isLoading ? null : _simpanHasil,
                  icon: _isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.white,
                            ),
                          ),
                        )
                      : const Icon(Icons.check_circle),
                  label: Text(
                    _isLoading ? 'Menyimpan...' : 'Analisis Sekarang',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0EA5E9),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            if (_selectedImage != null) const SizedBox(height: 12),
            if (_selectedImage != null)
              SizedBox(
                width: double.infinity,
                height: 56,
                child: OutlinedButton.icon(
                  onPressed: _clearImage,
                  icon: const Icon(Icons.close),
                  label: const Text('Batal'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red, width: 2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            if (_selectedImage == null) const SizedBox(height: 32),
            if (_selectedImage == null)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0EA5E9).withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFF0EA5E9),
                    width: 1.5,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.lightbulb, color: Color(0xFF0EA5E9)),
                        SizedBox(width: 8),
                        Text(
                          'Tips untuk Hasil Terbaik',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0EA5E9),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      '• Ambil foto pada kondisi cahaya yang cukup baik\n'
                      '• Fokus pada bagian tanaman yang menunjukkan gejala\n'
                      '• Pastikan foto jelas dan tidak blur\n'
                      '• Hindari bayangan pada objek utama',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[700],
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.orange.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.orange.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.info,
                            size: 18,
                            color: Colors.orange,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Hasil hanya valid jika confidence ≥ ${(minConfidence * 100).toStringAsFixed(0)}%',
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.orange,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Future<void> _scanFromCamera() async {
    final authProvider = context.read<AuthProvider>();
    if (!authProvider.isLoggedIn) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
      return;
    }

    try {
      final photo = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
      );
      if (photo != null) {
        setState(() {
          _selectedImage = photo;
        });
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  Future<void> _scanFromGallery() async {
    final authProvider = context.read<AuthProvider>();
    if (!authProvider.isLoggedIn) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
      return;
    }

    try {
      final photo = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
      );
      if (photo != null) {
        setState(() {
          _selectedImage = photo;
        });
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  Future<void> _simpanHasil() async {
    if (_selectedImage == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final result = await ApiService.predict(_selectedImage!).timeout(
        const Duration(seconds: 30),
        onTimeout: () => {
          'statusCode': 504,
          'data': {'message': 'Timeout: Server tidak merespons. Pastikan backend dan AI server running.'}
        },
      );

      if (!mounted) return;

      if (result['statusCode'] != 200 && result['statusCode'] != 201) {
        final errorMsg = result['data']['message'] ?? 'Prediksi gagal';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $errorMsg'),
            duration: const Duration(seconds: 5),
          ),
        );
        setState(() {
          _isLoading = false;
        });
        return;
      }

      final responseData = result['data'];
      final prediction = responseData['data']; // Mengambil object data di dalam JSON API
      final confidence = (prediction['confidence'] ?? 0.0).toDouble();

      if (confidence < minConfidence) {
        if (!mounted) return;
        _showInvalidDialog(context, confidence);
        setState(() {
          _isLoading = false;
        });
        return;
      }

      final rekomendasi = _getRekomendasi(prediction['penyakit']);

      final authProvider = context.read<AuthProvider>();
      final int? idPengguna = authProvider.isLoggedIn ? authProvider.user!.idPengguna : null;

      final deteksiResult = DeteksiResult(
        idPengguna: idPengguna,
        imagePath: _selectedImage!.path,
        namaGambar: _selectedImage!.path.split('/').last,
        resultPenyakit: prediction['penyakit'] ?? 'Tidak diketahui',
        confidence: confidence,
        rekomendasi: rekomendasi,
        waktu: DateTime.now(),
      );

      if (!mounted) return;
      bool saved = false;

      if (authProvider.isLoggedIn) {
        final provider = context.read<DeteksiProvider>();
        await provider.addDeteksiResult(deteksiResult, authProvider.user!.idPengguna);
        saved = true;
      }

      if (!mounted) return;
      _showResultDialog(context, prediction, confidence, rekomendasi, saved);

    } on SocketException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Network Error: $e\nPastikan device terhubung ke jaringan yang sama dengan server.',
          ),
          duration: const Duration(seconds: 5),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          duration: const Duration(seconds: 5),
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _showInvalidDialog(BuildContext context, double confidence) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hasil Tidak Valid'),
        icon: const Icon(Icons.error_outline, color: Colors.orange, size: 32),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Gambar yang diupload kemungkinan bukan tanaman atau kualitasnya tidak cukup baik.',
              style: TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Confidence Score: ${(confidence * 100).toStringAsFixed(1)}%',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.orange,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Minimum required: ${(minConfidence * 100).toStringAsFixed(0)}%',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Pastikan:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 8),
            const Text(
              '• Foto adalah tanaman anggur\n'
              '• Gambar jelas dan tidak blur\n'
              '• Pencahayaan cukup baik\n'
              '• Fokus pada area yang menunjukkan gejala',
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Coba Lagi'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _selectedImage = null;
              });
            },
            child: const Text('Batal', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showResultDialog(BuildContext context, dynamic prediction, double confidence, String rekomendasi, bool saved) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Hasil Deteksi'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Penyakit: ${prediction['penyakit'] ?? 'Tidak diketahui'}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 8),
            Text('Akurasi: ${(confidence * 100).toStringAsFixed(1)}%'),
            const SizedBox(height: 8),
            Text('Rekomendasi:\n$rekomendasi'),
            const SizedBox(height: 16),
            if (saved)
              const Text('✅ Berhasil disimpan di Riwayat', style: TextStyle(color: Colors.green))
            else
              const Text('⚠️ Tidak disimpan. Login untuk menyimpan riwayat.', style: TextStyle(color: Colors.orange)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _selectedImage = null;
              });
            },
            child: const Text('Tutup'),
          ),
        ],
      ),
    );
  }

  String _getRekomendasi(String penyakit) {
    switch (penyakit.toLowerCase()) {
      case 'black measles':
        return 'Cabut dan bakar daun yang terinfeksi. Gunakan fungisida sulfur atau tembaga.';
      case 'black rot':
        return 'Potong bagian yang membusuk. Berikan fungisida sistemik dan jaga ventilasi.';
      case 'healthy':
        return 'Tanaman sehat! Lanjutkan perawatan rutin dan monitoring teratur.';
      case 'isariopsis leaf spot':
        return 'Singkirkan daun yang terkena. Aplikasikan fungisida dan jaga kelembaban optimal.';
      default:
        return 'Konsultasi dengan ahli pertanian untuk penanganan lebih lanjut.';
    }
  }

  void _clearImage() {
    setState(() {
      _selectedImage = null;
    });
  }
}
