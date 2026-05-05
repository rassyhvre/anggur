import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io';
import 'dart:async';
import '../providers/deteksi_provider.dart';
import '../providers/auth_provider.dart';
import '../models/deteksi_result_model.dart' show DeteksiResult, PenangananItem;
import '../services/api_service.dart';

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

  // Data ensiklopedia penyakit anggur
  final List<Map<String, dynamic>> _diseases = [
    {
      'name': 'Black Rot',
      'icon': Icons.coronavirus,
      'color': Color(0xFF1E293B),
      'desc': 'Penyakit jamur yang menyebabkan bercak cokelat pada daun dan buah membusuk.',
    },
    {
      'name': 'Black Measles',
      'icon': Icons.bug_report,
      'color': Color(0xFF7C3AED),
      'desc': 'Dikenal juga sebagai Esca, menyerang pembuluh kayu tanaman anggur.',
    },
    {
      'name': 'Leaf Blight',
      'icon': Icons.local_fire_department,
      'color': Color(0xFFEA580C),
      'desc': 'Isariopsis leaf spot, menyebabkan bercak kuning-cokelat di permukaan daun.',
    },
    {
      'name': 'Healthy',
      'icon': Icons.eco,
      'color': Color(0xFF10B981),
      'desc': 'Daun sehat tanpa infeksi. Lanjutkan perawatan rutin untuk hasil panen optimal! 🌿',
    },
  ];

  final List<Map<String, String>> _tips = [
    {'title': 'Penyiraman Optimal', 'body': 'Siram anggur secara rutin pagi hari. Hindari menyiram saat matahari terik.', 'icon': '💧'},
    {'title': 'Pemangkasan Rutin', 'body': 'Pangkas cabang yang tidak produktif setiap 3 bulan untuk sirkulasi udara baik.', 'icon': '✂️'},
    {'title': 'Pupuk Organik', 'body': 'Gunakan kompos atau pupuk kandang untuk meningkatkan kesuburan tanah kebun.', 'icon': '🌱'},
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final userName = auth.user?.nama ?? 'Petani';

    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ===== HEADER WITH GREETING =====
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 28, 24, 32),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0284C7), Color(0xFF0EA5E9)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.eco_rounded, color: Colors.white, size: 28),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Text(
                          'rassyhvre',
                          style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.wb_sunny_rounded, color: Colors.amber, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              _getGreetingTime(),
                              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Halo, $userName! 👋',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Pantau kesehatan kebun anggur Anda hari ini',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withValues(alpha: 0.85),
                    ),
                  ),
                ],
              ),
            ),

            // ===== MAIN ACTION CARD (KLINIK TANAMAN) =====
            Transform.translate(
              offset: const Offset(0, -20),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF0284C7).withValues(alpha: 0.15),
                        blurRadius: 25,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: _selectedImage == null
                      ? Column(
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [Color(0xFF0284C7), Color(0xFF10B981)],
                                    ),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: const Icon(Icons.healing_rounded, color: Colors.white, size: 28),
                                ),
                                const SizedBox(width: 14),
                                const Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Klinik Tanaman',
                                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        'Diagnosa penyakit daun anggur secara instan dengan AI',
                                        style: TextStyle(fontSize: 13, color: Colors.grey),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            Row(
                              children: [
                                Expanded(
                                  child: _buildScanButton(
                                    icon: Icons.camera_alt_rounded,
                                    label: 'Kamera',
                                    color: const Color(0xFF0284C7),
                                    onTap: _isLoading ? null : _scanFromCamera,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildScanButton(
                                    icon: Icons.photo_library_rounded,
                                    label: 'Galeri',
                                    color: const Color(0xFF10B981),
                                    onTap: _isLoading ? null : _scanFromGallery,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        )
                      : Column(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(16),
                              child: SizedBox(
                                width: double.infinity,
                                height: 200,
                                child: kIsWeb
                                    ? Image.network(_selectedImage!.path, fit: BoxFit.cover)
                                    : Image.file(File(_selectedImage!.path), fit: BoxFit.cover),
                              ),
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              height: 52,
                              child: ElevatedButton.icon(
                                onPressed: _isLoading ? null : _simpanHasil,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF0284C7),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                  elevation: 0,
                                ),
                                icon: _isLoading
                                    ? const SizedBox(
                                        width: 20, height: 20,
                                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                                      )
                                    : const Icon(Icons.auto_awesome_rounded, size: 22),
                                label: Text(
                                  _isLoading ? 'AI sedang menganalisis...' : 'Diagnosa Sekarang',
                                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ),
                            const SizedBox(height: 10),
                            TextButton.icon(
                              onPressed: _isLoading ? null : _clearImage,
                              icon: const Icon(Icons.refresh_rounded, size: 18),
                              label: const Text('Pilih Ulang Foto'),
                              style: TextButton.styleFrom(foregroundColor: Colors.grey[600]),
                            ),
                          ],
                        ),
                ),
              ),
            ),

            // ===== SEASONAL INFO BANNER =====
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF10B981).withValues(alpha: 0.1),
                      const Color(0xFF0284C7).withValues(alpha: 0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
                ),
                child: const Row(
                  children: [
                    Text('🍇', style: TextStyle(fontSize: 28)),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Musim Tanam Aktif',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF065F46)),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Perhatikan kelembapan daun. Periksa secara rutin untuk mencegah infeksi jamur.',
                            style: TextStyle(fontSize: 12, color: Colors.black54),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ===== KAMUS PENYAKIT HEADER =====
            const Padding(
              padding: EdgeInsets.fromLTRB(24, 28, 24, 0),
              child: Row(
                children: [
                  Icon(Icons.menu_book_rounded, color: Color(0xFF0284C7), size: 22),
                  SizedBox(width: 8),
                  Text(
                    'Kamus Penyakit Anggur',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                  ),
                ],
              ),
            ),
            const Padding(
              padding: EdgeInsets.fromLTRB(24, 4, 24, 12),
              child: Text('Geser untuk mempelajari penyakit umum →', style: TextStyle(fontSize: 13, color: Colors.grey)),
            ),

            // ===== HORIZONTAL DISEASE CAROUSEL =====
            SizedBox(
              height: 175,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.only(left: 20, right: 12),
                physics: const BouncingScrollPhysics(),
                itemCount: _diseases.length,
                itemBuilder: (context, index) {
                  final d = _diseases[index];
                  return Container(
                    width: 260,
                    margin: const EdgeInsets.only(right: 14),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: (d['color'] as Color).withValues(alpha: 0.12),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: (d['color'] as Color).withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(d['icon'] as IconData, color: d['color'] as Color, size: 22),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                d['name'] as String,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: d['color'] as Color,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Expanded(
                          child: Text(
                            d['desc'] as String,
                            style: TextStyle(fontSize: 13, color: Colors.grey[600], height: 1.5),
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // ===== TIPS HARIAN HEADER =====
            const Padding(
              padding: EdgeInsets.fromLTRB(24, 24, 24, 0),
              child: Row(
                children: [
                  Icon(Icons.tips_and_updates_rounded, color: Color(0xFFEA580C), size: 22),
                  SizedBox(width: 8),
                  Text(
                    'Tips Perawatan',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                  ),
                ],
              ),
            ),

            // ===== TIPS LIST =====
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
              child: Column(
                children: _tips.map((tip) => _buildTipCard(tip)).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScanButton({required IconData icon, required String label, required Color color, required VoidCallback? onTap}) {
    return Material(
      color: color.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(width: 8),
              Text(label, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 15)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTipCard(Map<String, String> tip) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(tip['icon']!, style: const TextStyle(fontSize: 28)),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(tip['title']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF1E293B))),
                const SizedBox(height: 4),
                Text(tip['body']!, style: TextStyle(fontSize: 13, color: Colors.grey[600], height: 1.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ======== CAMERA & GALLERY LOGIC (unchanged) ========

  Future<void> _scanFromCamera() async {
    try {
      final photo = await _imagePicker.pickImage(
        source: ImageSource.camera, imageQuality: 80, maxWidth: 800, maxHeight: 800,
      );
      if (photo != null) setState(() => _selectedImage = photo);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  Future<void> _scanFromGallery() async {
    try {
      final photo = await _imagePicker.pickImage(
        source: ImageSource.gallery, imageQuality: 80, maxWidth: 800, maxHeight: 800,
      );
      if (photo != null) setState(() => _selectedImage = photo);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  Future<void> _simpanHasil() async {
    if (_selectedImage == null) return;
    setState(() => _isLoading = true);
    _showScanLoadingDialog();

    try {
      final result = await ApiService.predict(_selectedImage!);
      if (!mounted) return;

      final statusCode = result['statusCode'];
      final data = result['data'];

      // Dismiss loading dialog
      if (mounted && Navigator.canPop(context)) Navigator.pop(context);

      // Handle koneksi gagal (statusCode 0 dari _handleError)
      if (statusCode == 0) {
        if (!mounted) return;
        _showResultSheet(
          title: 'Koneksi Gagal',
          message: data['message'] ?? 'Tidak dapat terhubung ke server.',
          icon: Icons.wifi_off_rounded,
          iconColor: Colors.red,
        );
        setState(() => _isLoading = false);
        return;
      }

      // Handle 401 - token expired
      if (statusCode == 401) {
        if (!mounted) return;
        _showResultSheet(
          title: 'Sesi Berakhir',
          message: 'Silakan login ulang untuk melanjutkan.',
          icon: Icons.lock_outline_rounded,
          iconColor: Colors.orange,
        );
        setState(() => _isLoading = false);
        return;
      }

      // Cek apakah bukan daun anggur (bisa status 200 atau 400)
      // Response bisa di data['data'] atau langsung di data (root)
      final rawData = data['data'] ?? data;
      if (rawData['is_grape_leaf'] == false) {
        if (!mounted) return;
        _showResultSheet(
          title: 'Bukan Daun Anggur',
          message: rawData['message'] ?? data['message'] ?? 'Gambar tidak terdeteksi sebagai daun anggur.',
          icon: Icons.block_rounded,
          iconColor: Colors.redAccent,
        );
        setState(() => _isLoading = false);
        return;
      }

      if (statusCode != 200 && statusCode != 201) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: ${data['message'] ?? 'Prediksi gagal'}')));
        setState(() => _isLoading = false);
        return;
      }

      final prediction = data['data'] ?? data;

      final confidence = (prediction['confidence'] ?? 0.0).toDouble();

      if (confidence < minConfidence) {
        if (!mounted) return;
        _showResultSheet(
          title: 'Akurasi Rendah',
          message: 'AI hanya yakin ${(confidence * 100).toStringAsFixed(1)}%. Coba ambil foto yang lebih jelas.',
          icon: Icons.warning_amber_rounded,
          iconColor: Colors.orange,
        );
        setState(() => _isLoading = false);
        return;
      }

      // Gunakan factory yang parse penanganan dari database
      final deteksiResult = DeteksiResult.fromPredictResponse(
        prediction: prediction,
        localImagePath: _selectedImage!.path,
      );

      if (!mounted) return;
      await context.read<DeteksiProvider>().addDeteksiResult(deteksiResult);

      if (!mounted) return;
      final penyakit = deteksiResult.resultPenyakit ?? 'Tidak diketahui';
      _showDiagnosisSheet(
        penyakit: penyakit,
        confidence: confidence,
        penanganan: deteksiResult.penanganan,
        isHealthy: penyakit.toLowerCase() == 'healthy',
      );
      setState(() => _selectedImage = null);
    } on SocketException catch (e) {
      if (mounted && Navigator.canPop(context)) Navigator.pop(context);
      if (!mounted) return;
      _showResultSheet(
        title: 'Koneksi Gagal',
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.\n\nDetail: $e',
        icon: Icons.wifi_off_rounded,
        iconColor: Colors.red,
      );
    } catch (e) {
      if (mounted && Navigator.canPop(context)) Navigator.pop(context);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showScanLoadingDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black54,
      builder: (_) => const _ScanLoadingDialog(),
    );
  }

  /// Bottom sheet sederhana untuk error/warning (tanpa penanganan)
  void _showResultSheet({required String title, required String message, required IconData icon, required Color iconColor}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 36),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 48, color: iconColor),
            ),
            const SizedBox(height: 16),
            Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center, style: TextStyle(fontSize: 14, color: Colors.grey[700], height: 1.6)),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: iconColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: const Text('Mengerti', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Bottom sheet hasil diagnosa dengan penanganan dari database
  void _showDiagnosisSheet({
    required String penyakit,
    required double confidence,
    required List<PenangananItem> penanganan,
    required bool isHealthy,
  }) {
    final iconColor = isHealthy ? const Color(0xFF10B981) : const Color(0xFF0284C7);
    final icon = isHealthy ? Icons.check_circle_rounded : Icons.healing_rounded;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.55,
        minChildSize: 0.35,
        maxChildSize: 0.85,
        expand: false,
        builder: (context, scrollController) => Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
          child: ListView(
            controller: scrollController,
            children: [
              Center(
                child: Container(
                  width: 40, height: 4,
                  decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 20),
              Center(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: iconColor.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 48, color: iconColor),
                ),
              ),
              const SizedBox(height: 16),
              Text(penyakit, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
              const SizedBox(height: 8),
              Text(
                'Tingkat keyakinan: ${(confidence * 100).toStringAsFixed(1)}%',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              ),
              const SizedBox(height: 20),

              // Penanganan dari database
              if (penanganan.isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.25)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.healing_rounded, color: Color(0xFF10B981), size: 20),
                          SizedBox(width: 8),
                          Text('Penanganan (dari database)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF065F46))),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ...penanganan.asMap().entries.map((entry) {
                        final i = entry.key;
                        final step = entry.value;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 24, height: 24,
                                decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(7)),
                                child: Center(child: Text('${i + 1}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(step.judulPenanganan, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                    const SizedBox(height: 2),
                                    Text(step.deskripsiPenanganan, style: TextStyle(fontSize: 12, color: Colors.grey[700], height: 1.5)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ] else if (isHealthy) ...[
                Text(
                  'Tanaman Anda sehat! Pertahankan perawatan rutin dan monitoring berkala. 🌿',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: Colors.grey[700], height: 1.6),
                ),
              ],

              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: iconColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  child: const Text('Mengerti', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getGreetingTime() {
    final hour = DateTime.now().hour;
    if (hour < 5) return 'Dini Hari';
    if (hour < 11) return 'Pagi';
    if (hour < 15) return 'Siang';
    if (hour < 18) return 'Sore';
    return 'Malam';
  }

  void _clearImage() {
    setState(() => _selectedImage = null);
  }
}

// ==================== LOADING DIALOG ====================
class _ScanLoadingDialog extends StatefulWidget {
  const _ScanLoadingDialog();
  @override
  State<_ScanLoadingDialog> createState() => _ScanLoadingDialogState();
}

class _ScanLoadingDialogState extends State<_ScanLoadingDialog> with TickerProviderStateMixin {
  late final AnimationController _spinController;
  late final AnimationController _pulseController;
  late final AnimationController _scanLineController;
  int _msgIndex = 0;
  Timer? _msgTimer;

  static const _messages = [
    'Mengunggah gambar...',
    'AI sedang menganalisis daun...',
    'Mendeteksi pola penyakit...',
    'Mencocokkan dengan database...',
    'Menyiapkan hasil diagnosis...',
  ];

  @override
  void initState() {
    super.initState();
    _spinController = AnimationController(vsync: this, duration: const Duration(seconds: 3))..repeat();
    _pulseController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1800))..repeat();
    _scanLineController = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat(reverse: true);
    _msgTimer = Timer.periodic(const Duration(milliseconds: 2200), (_) {
      if (mounted) setState(() => _msgIndex = (_msgIndex + 1) % _messages.length);
    });
  }

  @override
  void dispose() {
    _spinController.dispose();
    _pulseController.dispose();
    _scanLineController.dispose();
    _msgTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Center(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 40),
          padding: const EdgeInsets.fromLTRB(32, 40, 32, 32),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 40, offset: const Offset(0, 16)),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Animated leaf scanner
              SizedBox(
                width: 120, height: 120,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Pulse ring
                    AnimatedBuilder(
                      animation: _pulseController,
                      builder: (_, __) {
                        final scale = 1.0 + _pulseController.value * 1.0;
                        final opacity = 1.0 - _pulseController.value;
                        return Transform.scale(
                          scale: scale,
                          child: Container(
                            width: 90, height: 90,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFF16A34A).withValues(alpha: opacity * 0.4), width: 2),
                            ),
                          ),
                        );
                      },
                    ),
                    // Leaf circle
                    Container(
                      width: 90, height: 90,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          colors: [Color(0xFFDCFCE7), Color(0xFFBBF7D0)],
                          begin: Alignment.topLeft, end: Alignment.bottomRight,
                        ),
                        boxShadow: [BoxShadow(color: const Color(0xFF16A34A).withValues(alpha: 0.2), blurRadius: 20, offset: const Offset(0, 6))],
                      ),
                      child: AnimatedBuilder(
                        animation: _spinController,
                        builder: (_, child) => Transform.rotate(
                          angle: _spinController.value * 6.28,
                          child: child,
                        ),
                        child: const Center(child: Text('🍃', style: TextStyle(fontSize: 42, decoration: TextDecoration.none))),
                      ),
                    ),
                    // Scan line
                    AnimatedBuilder(
                      animation: _scanLineController,
                      builder: (_, __) {
                        final top = 10.0 + _scanLineController.value * 96.0;
                        return Positioned(
                          top: top, left: 10, right: 10,
                          child: Container(
                            height: 3,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(2),
                              gradient: const LinearGradient(
                                colors: [Colors.transparent, Color(0xFF16A34A), Colors.transparent],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              // Progress bar
              ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: SizedBox(
                  height: 5, width: double.infinity,
                  child: LinearProgressIndicator(
                    backgroundColor: const Color(0xFFF1F5F9),
                    valueColor: const AlwaysStoppedAnimation(Color(0xFF16A34A)),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Message
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 400),
                child: Text(
                  _messages[_msgIndex],
                  key: ValueKey(_msgIndex),
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Color(0xFF0F172A), decoration: TextDecoration.none),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Mohon tunggu beberapa detik',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8), decoration: TextDecoration.none),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
