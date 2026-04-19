import 'package:flutter/material.dart';
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
  List<dynamic> _penanganan = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    try {
      final res = await ApiService.getDeteksiDetail(widget.id);
      print('Detail API response: ${res['statusCode']}');
      print('Detail data: ${res['data']}');
      if (res['statusCode'] == 200) {
        setState(() {
          _detail = res['data']['data'];
          _penanganan = _detail?['penanganan'] ?? [];
          print('Penanganan count: ${_penanganan.length}');
          print('Penanganan data: $_penanganan');
          _isLoading = false;
        });
      } else {
        print('Detail error: ${res['data']}');
        setState(() {
          _error = res['data']['message'] ?? 'Gagal memuat detail';
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Detail exception: $e');
      setState(() {
        _error = 'Tidak dapat terhubung ke server: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Colors.grey[50],
        appBar: _buildAppBar(),
        body: const Center(child: CircularProgressIndicator(color: Color(0xFF0284C7))),
      );
    }

    if (_error != null || _detail == null) {
      return Scaffold(
        appBar: _buildAppBar(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline_rounded, size: 56, color: Colors.grey),
              const SizedBox(height: 16),
              Text(_error ?? 'Data tidak ditemukan', style: const TextStyle(color: Colors.grey)),
            ],
          ),
        ),
      );
    }

    final imageUrl = '${AppConstants.uploadsUrl}/${_detail!['gambar_upload']}';
    final namaPenyakit = _detail!['nama_penyakit'] ?? 'Tidak diketahui';
    final deskripsi = _detail!['deskripsi'] ?? 'Tidak ada deskripsi tersedia dari database.';
    final penyebab = _detail!['penyebab'] ?? 'Tidak tersedia data penyebab dari database.';
    final confidence = double.tryParse((_detail!['tingkat_keyakinan'] ?? '0').toString()) ?? 0.0;
    final isHealthy = namaPenyakit.toLowerCase() == 'healthy';

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // ===== SLIVER APP BAR WITH IMAGE =====
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            stretch: true,
            backgroundColor: const Color(0xFF0284C7),
            foregroundColor: Colors.white,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: Colors.grey[300],
                      child: const Icon(Icons.broken_image_rounded, size: 64, color: Colors.grey),
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.6),
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 20,
                    left: 20,
                    right: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: isHealthy ? const Color(0xFF10B981) : Colors.orange,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            isHealthy ? '✅ Sehat' : '⚠️ Terdeteksi Penyakit',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          namaPenyakit,
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            shadows: [Shadow(blurRadius: 10, color: Colors.black38)],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ===== BODY CONTENT =====
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Confidence Meter
                  _buildConfidenceMeter(confidence),
                  const SizedBox(height: 20),

                  // Deskripsi (dari database tabel penyakit)
                  _buildInfoCard(
                    icon: Icons.description_rounded,
                    iconColor: const Color(0xFF0284C7),
                    title: 'Deskripsi Penyakit',
                    content: deskripsi,
                  ),
                  const SizedBox(height: 14),

                  // Penyebab (dari database tabel penyakit)
                  _buildInfoCard(
                    icon: Icons.biotech_rounded,
                    iconColor: const Color(0xFF7C3AED),
                    title: 'Penyebab',
                    content: penyebab,
                  ),
                  const SizedBox(height: 14),

                  // Penanganan (DARI DATABASE tabel penanganan)
                  _buildPenangananFromDB(),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      title: const Text('Detail Analisis'),
      backgroundColor: const Color(0xFF0284C7),
      foregroundColor: Colors.white,
      elevation: 0,
    );
  }

  Widget _buildConfidenceMeter(double confidence) {
    final pct = confidence * 100;
    final color = pct >= 80
        ? const Color(0xFF10B981)
        : pct >= 60
            ? const Color(0xFF0284C7)
            : Colors.orange;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          SizedBox(
            width: 70,
            height: 70,
            child: Stack(
              fit: StackFit.expand,
              children: [
                CircularProgressIndicator(
                  value: confidence,
                  strokeWidth: 8,
                  backgroundColor: Colors.grey[200],
                  valueColor: AlwaysStoppedAnimation(color),
                  strokeCap: StrokeCap.round,
                ),
                Center(
                  child: Text(
                    '${pct.toStringAsFixed(0)}%',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: color),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Tingkat Keyakinan AI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1E293B))),
                const SizedBox(height: 4),
                Text(
                  pct >= 80
                      ? 'Diagnosa sangat akurat.'
                      : pct >= 60
                          ? 'Diagnosa cukup baik.'
                          : 'Disarankan untuk mengambil ulang foto.',
                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({required IconData icon, required Color iconColor, required String title, required String content}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: iconColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              const SizedBox(width: 10),
              Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
            ],
          ),
          const SizedBox(height: 14),
          Text(content, style: TextStyle(fontSize: 14, color: Colors.grey[700], height: 1.6)),
        ],
      ),
    );
  }

  /// Widget Penanganan yang 100% dari Database (tabel `penanganan`)
  Widget _buildPenangananFromDB() {
    if (_penanganan.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.orange.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            const Icon(Icons.info_outline, color: Colors.orange),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Data penanganan belum tersedia di database untuk penyakit ini.',
                style: TextStyle(fontSize: 13, color: Colors.grey[700]),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(color: const Color(0xFF10B981).withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.healing_rounded, color: Color(0xFF10B981), size: 20),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Langkah Penanganan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF065F46))),
                    SizedBox(height: 2),
                    Text('Data dari database server', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._penanganan.asMap().entries.map((entry) {
            final i = entry.key;
            final step = entry.value;
            final judul = step['judul_penanganan'] ?? 'Langkah ${i + 1}';
            final deskripsi = step['deskripsi_penanganan'] ?? '-';
            return Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text('${i + 1}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(judul, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1E293B))),
                        const SizedBox(height: 3),
                        Text(deskripsi, style: TextStyle(fontSize: 13, color: Colors.grey[600], height: 1.5)),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
