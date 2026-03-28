import 'package:flutter/material.dart';
import '../models/deteksi_result_model.dart';
import '../services/database_service.dart';

class DeteksiProvider extends ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();
  List<DeteksiResult> _deteksiResults = [];
  bool _isLoading = false;

  List<DeteksiResult> get deteksiResults => _deteksiResults;
  bool get isLoading => _isLoading;

  Future<void> loadDeteksiResults() async {
    _isLoading = true;
    notifyListeners();

    try {
      _deteksiResults = await _dbService.getAllDeteksiResults();
    } catch (e) {
      print('Error loading deteksi results: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addDeteksiResult(DeteksiResult result) async {
    try {
      await _dbService.insertDeteksiResult(result);
      await loadDeteksiResults();
    } catch (e) {
      print('Error adding deteksi result: $e');
    }
  }

  Future<void> deleteDeteksiResult(int id) async {
    try {
      await _dbService.deleteDeteksiResult(id);
      await loadDeteksiResults();
    } catch (e) {
      print('Error deleting deteksi result: $e');
    }
  }

  Future<void> clearAllDeteksiResults() async {
    try {
      await _dbService.deleteAllDeteksiResults();
      await loadDeteksiResults();
    } catch (e) {
      print('Error clearing deteksi results: $e');
    }
  }
}
