import 'package:flutter/material.dart';

class TentangScreen extends StatelessWidget {
  const TentangScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // ===== Header =====
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 36, 24, 44),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0284C7), Color(0xFF0EA5E9)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(40),
                  bottomRight: Radius.circular(40),
                ),
              ),
              child: Column(
                children: [
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 20, offset: const Offset(0, 10)),
                      ],
                    ),
                    child: const Center(child: Icon(Icons.eco_rounded, size: 50, color: Color(0xFF10B981))),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'rassyhvre',
                    style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text('v1.1.0', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
            ),

            // ===== Content =====
            Transform.translate(
              offset: const Offset(0, -24),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    // About Card
                    _buildCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0284C7).withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.info_outline_rounded, color: Color(0xFF0284C7), size: 20),
                              ),
                              const SizedBox(width: 10),
                              const Text('Tentang Aplikasi', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'rassyhvre adalah solusi inovatif berbasis AI untuk mendeteksi dan mendiagnosa penyakit pada tanaman anggur. Cukup ambil foto daun, dan AI akan memberikan analisis serta rekomendasi penanganan secara instan.',
                            style: TextStyle(fontSize: 14, color: Colors.grey[700], height: 1.7),
                            textAlign: TextAlign.justify,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Features
                    _buildCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Fitur Unggulan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 16),
                          _featureRow(Icons.camera_enhance_rounded, const Color(0xFF0284C7), 'Deteksi Instan', 'Foto dan analisis dalam hitungan detik'),
                          _featureRow(Icons.cloud_done_rounded, const Color(0xFF10B981), 'Cloud Sync', 'Riwayat tersimpan aman di server'),
                          _featureRow(Icons.auto_awesome_rounded, const Color(0xFF7C3AED), 'Model AI Keras', 'Akurasi tinggi dengan deep learning'),
                          _featureRow(Icons.healing_rounded, Colors.orange, 'Panduan Penanganan', 'Langkah-langkah penanganan detail'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Tech Stack
                    _buildCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Teknologi', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 16),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _techChip('Flutter', const Color(0xFF0284C7)),
                              _techChip('TensorFlow', Colors.orange),
                              _techChip('Node.js', const Color(0xFF10B981)),
                              _techChip('FastAPI', const Color(0xFF7C3AED)),
                              _techChip('MySQL', const Color(0xFF0EA5E9)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Dedication
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(0xFF0284C7).withValues(alpha: 0.08),
                            const Color(0xFF10B981).withValues(alpha: 0.08),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.2)),
                      ),
                      child: const Column(
                        children: [
                          Text('🍇', style: TextStyle(fontSize: 36)),
                          SizedBox(height: 12),
                          Text(
                            'Dipersembahkan untuk\nPetani Anggur Indonesia',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, height: 1.4),
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Meningkatkan produktivitas panen melalui teknologi kecerdasan buatan.',
                            style: TextStyle(fontSize: 13, color: Colors.black54),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: child,
    );
  }

  Widget _featureRow(IconData icon, Color color, String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text(subtitle, style: TextStyle(fontSize: 13, color: Colors.grey[500])),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _techChip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(label, style: TextStyle(fontWeight: FontWeight.w600, color: color, fontSize: 13)),
    );
  }
}
