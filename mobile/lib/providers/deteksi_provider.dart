import 'package:flutter/material.dart';
import '../models/deteksi_result_model.dart';
import '../services/database_service.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class DeteksiProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();
  List<DeteksiResult> _deteksiResults = [];
  bool _isLoading = false;

  List<DeteksiResult> get deteksiResults => _deteksiResults;
  bool get isLoading => _isLoading;

  Future<void> loadDeteksiResults() async {
    if (kIsWeb) return;
    _isLoading = true;
    notifyListeners();

    try {
      _deteksiResults = await _dbService.getAllDeteksiResults();
    } catch (e) {
      rethrow;
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addDeteksiResult(DeteksiResult result) async {
    if (kIsWeb) return;
    try {
      await _dbService.insertDeteksiResult(result);
      await loadDeteksiResults();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> deleteDeteksiResult(int id) async {
    if (kIsWeb) return;
    try {
      await _dbService.deleteDeteksiResult(id);
      await loadDeteksiResults();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> clearAllDeteksiResults() async {
    if (kIsWeb) return;
    try {
      await _dbService.deleteAllDeteksiResults();
      await loadDeteksiResults();
    } catch (e) {
      rethrow;
    }
  }
}
