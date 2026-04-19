import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/pengguna.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  Pengguna? _user;
  bool _isLoading = false;

  Pengguna? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;

  AuthProvider() {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      final data = jsonDecode(userStr);
      _user = Pengguna(
        idPengguna: data['id_pengguna'] ?? 0,
        nama: data['nama'] ?? '',
        email: data['email'] ?? '',
        role: data['role'] ?? 'user',
      );
      notifyListeners();
    }
  }

  Future<String?> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final result = await ApiService.login(email, password);
      if (result['statusCode'] == 200) {
        final data = result['data']['data'];
        _user = Pengguna(
          idPengguna: data['id_pengguna'] ?? 0,
          nama: data['nama'] ?? '',
          email: data['email'] ?? '',
          role: data['role'] ?? 'user',
        );
        _isLoading = false;
        notifyListeners();
        return null;
      } else {
        _isLoading = false;
        notifyListeners();
        return result['data']['message'] ?? 'Login gagal';
      }
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      print("API Error: $e");
      return 'Error: $e';
    }
  }

  Future<String?> register(String nama, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final result = await ApiService.register(nama, email, password);
      if (result['statusCode'] == 201) {
        final data = result['data']['data'];
        _user = Pengguna(
          idPengguna: data['id_pengguna'] ?? 0,
          nama: data['nama'] ?? '',
          email: data['email'] ?? '',
          role: data['role'] ?? 'user',
        );
        _isLoading = false;
        notifyListeners();
        return null;
      } else {
        _isLoading = false;
        notifyListeners();
      return result['data']['message'] ?? 'Registrasi gagal';
    }
  } catch (e) {
    _isLoading = false;
    notifyListeners();
    print("API Error: $e");
    return 'Error: $e';
  }
}

  Future<void> logout() async {
    await ApiService.logout();
    _user = null;
    notifyListeners();
  }
}
