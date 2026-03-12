class AppConstants {
  // Ganti dengan IP address komputer kamu jika testing di device fisik
  // Untuk emulator Android, gunakan 10.0.2.2
  // Untuk device fisik, gunakan IP lokal komputer (misal 192.168.x.x)
  static const String baseUrl = 'http://10.0.2.2:5000';
  static const String apiUrl = '$baseUrl/api';
  static const String uploadsUrl = '$baseUrl/uploads';

  static const String appName = 'AgroScan';
  static const String appDescription =
      'Deteksi penyakit pada tanaman anggur menggunakan AI';
}
