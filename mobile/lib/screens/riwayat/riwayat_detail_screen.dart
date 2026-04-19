import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/api_service.dart';
import '../../config/constants.dart';

class RiwayatDetailScreen extends StatefulWidget {
  final int id;

  const RiwayatDetailScreen({super.key, required this.id});

  @override
  State<RiwayatDetailScreen> createState() => _RiwayatDetailScreenState();
}

class _RiwayatDetailScreenState extends State<RiwayatDetailScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _detail;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    try {
      final res = await ApiService.getDeteksiDetail(widget.id);
      if (res['statusCode'] == 200) {
        setState(() {
          _detail = res['data']['data'];
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = res['data']['message'] ?? 'Gagal memuat detail';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Tidak dapat terhubung ke server';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null || _detail == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Riwayat')),
        body: Center(child: Text(_error ?? 'Data tidak ditemukan')),
      );
    }

    final imageUrl = '${AppConstants.uploadsUrl}/${_detail!['gambar_upload']}';
    final namaPenyakit = _detail!['nama_penyakit'] ?? 'Tidak diketahui';
    final deskripsi = _detail!['deskripsi'] ?? 'Tidak ada deskripsi';
    final penyebab = _detail!['penyebab'] ?? 'Tidak ada penyebab detail';
    final confidence = double.tryParse((_detail!['tingkat_keyakinan'] ?? '0').toString()) ?? 0.0;
    
    // We parse array of penanganan if available, for now display deskripsi & penyebab
    // Note: Detail endpoint currently returns basic p.* fields as defined in hasilDeteksiModel

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Detail Analisis'),
        backgroundColor: const Color(0xFF16A34A),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 250,
              width: double.infinity,
              color: Colors.grey[300],
              child: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) =>
                    const Icon(Icons.broken_image, size: 50, color: Colors.grey),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          namaPenyakit,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFF16A34A).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '${(confidence * 100).toStringAsFixed(1)}%',
                          style: const TextStyle(
                            color: Color(0xFF16A34A),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _buildSectionCard(
                    title: 'Deskripsi',
                    icon: Icons.info_outline,
                    content: deskripsi,
                  ),
                  const SizedBox(height: 16),
                  _buildSectionCard(
                    title: 'Penyebab',
                    icon: Icons.search,
                    content: penyebab,
                  ),
                  const SizedBox(height: 16),
                  // Dummy Penanganan Card as placeholder until penanganan is joined in DB specifically in getById
                  _buildSectionCard(
                    title: 'Cara Penanganan',
                    icon: Icons.healing,
                    content: 'Gunakan fungisida berbahan aktif tembaga, buang daun yang terinfeksi dan pastikan sirkulasi udara di kebun (Kanopi) berjalan baik untuk mengurangi kelembapan.',
                    iconColor: Colors.orange,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required String content,
    Color iconColor = const Color(0xFF16A34A),
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF374151),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
