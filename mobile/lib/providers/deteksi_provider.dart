import 'package:flutter/material.dart';
import '../models/deteksi_result_model.dart';
import '../services/api_service.dart';
import '../config/constants.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class DeteksiProvider extends ChangeNotifier {
  List<DeteksiResult> _deteksiResults = [];
  bool _isLoading = false;

  List<DeteksiResult> get deteksiResults => _deteksiResults;
  bool get isLoading => _isLoading;

  Future<void> loadDeteksiResults() async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.getRiwayat();
      if (res['statusCode'] == 200) {
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
      }
    } catch (e) {
      // ignore
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addDeteksiResult(DeteksiResult result) async {
    // Penambahan deteksi di-handle secara otomatis oleh endpoint predict!
    // Kita cukup nge-load ulang saja!
    await loadDeteksiResults();
  }

  Future<void> deleteDeteksiResult(int id) async {
    // TODO: implement jika backend memiliki endpoint DELETE
    // Untuk saat ini kita hapus dari state lokal jika API belum sedia.
    _deteksiResults.removeWhere((item) => item.id == id);
    notifyListeners();
  }

  Future<void> clearAllDeteksiResults() async {
    _deteksiResults.clear();
    notifyListeners();
  }
}
