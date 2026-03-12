import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/constants.dart';

class ApiService {
  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Map<String, String>> _authHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // ==================== AUTH ====================

  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final response = await http.post(
      Uri.parse('${AppConstants.apiUrl}/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      await prefs.setString('user', jsonEncode(data));
    }

    return {'statusCode': response.statusCode, 'data': data};
  }

  static Future<Map<String, dynamic>> register(
      String nama, String email, String password) async {
    final response = await http.post(
      Uri.parse('${AppConstants.apiUrl}/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'nama': nama, 'email': email, 'password': password}),
    );
    final data = jsonDecode(response.body);

    if (response.statusCode == 201) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      await prefs.setString('user', jsonEncode(data));
    }

    return {'statusCode': response.statusCode, 'data': data};
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }

  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr == null) return null;
    return jsonDecode(userStr);
  }

  static Future<bool> isLoggedIn() async {
    final token = await _getToken();
    return token != null;
  }

  // ==================== DETEKSI ====================

  static Future<Map<String, dynamic>> predict(File imageFile) async {
    final token = await _getToken();
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('${AppConstants.apiUrl}/deteksi/predict'),
    );

    if (token != null) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    request.files.add(
      await http.MultipartFile.fromPath('file', imageFile.path),
    );

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);
    final data = jsonDecode(response.body);

    return {'statusCode': response.statusCode, 'data': data};
  }

  // ==================== RIWAYAT ====================

  static Future<Map<String, dynamic>> getRiwayat() async {
    final headers = await _authHeaders();
    final response = await http.get(
      Uri.parse('${AppConstants.apiUrl}/deteksi/riwayat'),
      headers: headers,
    );
    final data = jsonDecode(response.body);
    return {'statusCode': response.statusCode, 'data': data};
  }

  static Future<Map<String, dynamic>> getDeteksiDetail(int id) async {
    final headers = await _authHeaders();
    final response = await http.get(
      Uri.parse('${AppConstants.apiUrl}/deteksi/$id'),
      headers: headers,
    );
    final data = jsonDecode(response.body);
    return {'statusCode': response.statusCode, 'data': data};
  }
}
