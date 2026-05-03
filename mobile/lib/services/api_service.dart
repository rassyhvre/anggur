import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import '../config/constants.dart';

class ApiService {
  // Timeout settings
  static const Duration _readTimeout = Duration(seconds: 15);
  static const Duration _uploadTimeout = Duration(seconds: 60);

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

  /// Helper untuk handle HTTP errors secara konsisten
  static Map<String, dynamic> _handleError(Object e) {
    String message;
    if (e is SocketException) {
      message = 'Tidak dapat terhubung ke server. Periksa koneksi internet dan pastikan server berjalan.';
    } else if (e is HttpException) {
      message = 'Server error: ${e.message}';
    } else if (e is http.ClientException) {
      message = 'Koneksi ke server gagal. Pastikan server backend berjalan di ${AppConstants.baseUrl}';
    } else {
      message = 'Error: $e';
    }
    print('[ApiService] Error: $e');
    return {
      'statusCode': 0,
      'data': {'success': false, 'message': message},
    };
  }

  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse('${AppConstants.apiUrl}/auth/login'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'email': email, 'password': password}),
          )
          .timeout(_readTimeout);

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['data']['token']);
        await prefs.setString('user', jsonEncode(data['data']));
      }

      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> register(
      String nama, String email, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse('${AppConstants.apiUrl}/auth/register'),
            headers: {'Content-Type': 'application/json'},
            body:
                jsonEncode({'nama': nama, 'email': email, 'password': password}),
          )
          .timeout(_readTimeout);

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['data']['token']);
        await prefs.setString('user', jsonEncode(data['data']));
      }

      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
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

  static Future<Map<String, dynamic>> predict(XFile imageFile) async {
    try {
      final token = await _getToken();
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('${AppConstants.apiUrl}/deteksi/predict'),
      );

      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      final bytes = await imageFile.readAsBytes();
      request.files.add(
        http.MultipartFile.fromBytes('file', bytes, filename: imageFile.name),
      );

      print('[ApiService] Sending predict request to ${AppConstants.apiUrl}/deteksi/predict');

      final streamedResponse = await request.send().timeout(_uploadTimeout);
      final response = await http.Response.fromStream(streamedResponse);

      print('[ApiService] Predict response: ${response.statusCode}');
      print('[ApiService] Predict body: ${response.body.length > 300 ? response.body.substring(0, 300) : response.body}');

      final data = jsonDecode(response.body);
      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getRiwayat() async {
    try {
      final headers = await _authHeaders();
      final response = await http
          .get(
            Uri.parse('${AppConstants.apiUrl}/deteksi/riwayat'),
            headers: headers,
          )
          .timeout(_readTimeout);

      final data = jsonDecode(response.body);
      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getDeteksiDetail(int id) async {
    try {
      final headers = await _authHeaders();
      final response = await http
          .get(
            Uri.parse('${AppConstants.apiUrl}/deteksi/$id'),
            headers: headers,
          )
          .timeout(_readTimeout);

      final data = jsonDecode(response.body);
      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> deleteDeteksi(int id) async {
    try {
      final headers = await _authHeaders();
      final response = await http
          .delete(
            Uri.parse('${AppConstants.apiUrl}/deteksi/$id'),
            headers: headers,
          )
          .timeout(_readTimeout);

      final data = jsonDecode(response.body);
      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getStats() async {
    try {
      final headers = await _authHeaders();
      final response = await http
          .get(
            Uri.parse('${AppConstants.apiUrl}/deteksi/stats'),
            headers: headers,
          )
          .timeout(_readTimeout);

      final data = jsonDecode(response.body);
      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> uploadProfilePhoto(
      XFile imageFile) async {
    try {
      final token = await _getToken();
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('${AppConstants.apiUrl}/auth/profile/photo'),
      );

      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      final bytes = await imageFile.readAsBytes();
      request.files.add(
        http.MultipartFile.fromBytes('photo', bytes, filename: imageFile.name),
      );

      final streamedResponse = await request.send().timeout(_uploadTimeout);
      final response = await http.Response.fromStream(streamedResponse);
      final data = jsonDecode(response.body);

      // Update user data di SharedPreferences jika berhasil
      if (response.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        final userStr = prefs.getString('user');
        if (userStr != null) {
          final userData = jsonDecode(userStr);
          userData['foto_profil'] = data['data']['foto_profil'];
          await prefs.setString('user', jsonEncode(userData));
        }
      }

      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getProfile() async {
    try {
      final headers = await _authHeaders();
      final response = await http
          .get(
            Uri.parse('${AppConstants.apiUrl}/auth/profile'),
            headers: headers,
          )
          .timeout(_readTimeout);

      final data = jsonDecode(response.body);
      return {'statusCode': response.statusCode, 'data': data};
    } catch (e) {
      return _handleError(e);
    }
  }
}
