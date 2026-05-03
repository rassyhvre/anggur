import 'package:flutter/material.dart';
import '../models/deteksi_result_model.dart';
import '../services/api_service.dart';
import '../config/constants.dart';

class DeteksiProvider extends ChangeNotifier {
  List<DeteksiResult> _deteksiResults = [];
  bool _isLoading = false;

  // Stats dari database
  int _totalScan = 0;
  int _sehat = 0;
  int _terinfeksi = 0;
  bool _statsLoading = true;

  // Error state
  String? _error;

  List<DeteksiResult> get deteksiResults => _deteksiResults;
  bool get isLoading => _isLoading;
  int get totalScan => _totalScan;
  int get sehat => _sehat;
  int get terinfeksi => _terinfeksi;
  bool get statsLoading => _statsLoading;
  String? get error => _error;

  Future<void> loadDeteksiResults() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await ApiService.getRiwayat();
      final statusCode = res['statusCode'];

      if (statusCode == 0) {
        // Koneksi gagal
        _error = res['data']['message'] ?? 'Tidak dapat terhubung ke server';
      } else if (statusCode == 401) {
        _error = 'Sesi berakhir. Silakan login ulang.';
      } else if (statusCode == 200) {
        final List<dynamic> data = res['data']['data'] ?? [];
        _deteksiResults = data.map((e) {
          return DeteksiResult(
            id: e['id_deteksi'],
            imagePath: '${AppConstants.uploadsUrl}/${e['gambar_upload']}',
            namaGambar: e['gambar_upload'],
            resultPenyakit: e['nama_penyakit'],
            confidence: double.tryParse((e['tingkat_keyakinan'] ?? '0').toString()),
            waktu: DateTime.parse(e['tanggal_deteksi']).toLocal(),
          );
        }).toList();
        _error = null;
      } else {
        _error = res['data']['message'] ?? 'Gagal memuat riwayat';
      }
    } catch (e) {
      _error = 'Error: $e';
      print('[DeteksiProvider] loadDeteksiResults error: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Muat stats dari database (endpoint /deteksi/stats)
  Future<void> loadStats() async {
    _statsLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.getStats();
      final statusCode = res['statusCode'];

      if (statusCode == 200) {
        final statsData = res['data']['data'];
        _totalScan = statsData['total'] ?? 0;
        _sehat = statsData['sehat'] ?? 0;
        _terinfeksi = statsData['terinfeksi'] ?? 0;
      } else if (statusCode == 0) {
        print('[DeteksiProvider] Stats: koneksi gagal');
      } else {
        print('[DeteksiProvider] Stats error: ${res['data']}');
      }
    } catch (e) {
      print('[DeteksiProvider] loadStats error: $e');
    }

    _statsLoading = false;
    notifyListeners();
  }

  Future<void> addDeteksiResult(DeteksiResult result) async {
    // Penambahan deteksi di-handle secara otomatis oleh endpoint predict!
    // Reload riwayat + stats dari database
    await loadDeteksiResults();
    await loadStats();
  }

  Future<void> deleteDeteksiResult(int id) async {
    try {
      await ApiService.deleteDeteksi(id);
      _deteksiResults.removeWhere((item) => item.id == id);
      notifyListeners();
      // Refresh stats setelah hapus
      await loadStats();
    } catch (e) {
      _deteksiResults.removeWhere((item) => item.id == id);
      notifyListeners();
    }
  }

  Future<void> clearAllDeteksiResults() async {
    _deteksiResults.clear();
    notifyListeners();
  }
}
