class DeteksiResult {
  final int? id;
  final String imagePath;
  final String? namaGambar;
  final String? resultPenyakit;
  final double? confidence;
  final String? rekomendasi;
  final DateTime waktu;
  final String? deskripsiPenyakit;
  final String? penyebab;
  final List<PenangananItem> penanganan;

  DeteksiResult({
    this.id,
    required this.imagePath,
    this.namaGambar,
    this.resultPenyakit,
    this.confidence,
    this.rekomendasi,
    required this.waktu,
    this.deskripsiPenyakit,
    this.penyebab,
    this.penanganan = const [],
  });

  Map<String, dynamic> toMap() {
    return {
      'imagePath': imagePath,
      'namaGambar': namaGambar,
      'resultPenyakit': resultPenyakit,
      'confidence': confidence,
      'rekomendasi': rekomendasi,
      'waktu': waktu.toIso8601String(),
    };
  }

  factory DeteksiResult.fromMap(Map<String, dynamic> map) {
    return DeteksiResult(
      id: map['id'],
      imagePath: map['imagePath'],
      namaGambar: map['namaGambar'],
      resultPenyakit: map['resultPenyakit'],
      confidence: map['confidence'],
      rekomendasi: map['rekomendasi'],
      waktu: DateTime.parse(map['waktu']),
    );
  }

  /// Factory dari response API predict yang sudah include penanganan dari database
  factory DeteksiResult.fromPredictResponse({
    required Map<String, dynamic> prediction,
    required String localImagePath,
  }) {
    final penangananList = (prediction['penanganan'] as List<dynamic>?)
            ?.map((e) => PenangananItem.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return DeteksiResult(
      id: prediction['id_deteksi'],
      imagePath: localImagePath,
      namaGambar: localImagePath.split('/').last,
      resultPenyakit: prediction['penyakit'] ?? 'Tidak diketahui',
      confidence: (prediction['confidence'] ?? 0.0).toDouble(),
      waktu: DateTime.now(),
      penanganan: penangananList,
    );
  }
}

/// Model penanganan dari database (tabel `penanganan`)
class PenangananItem {
  final String judulPenanganan;
  final String deskripsiPenanganan;

  PenangananItem({
    required this.judulPenanganan,
    required this.deskripsiPenanganan,
  });

  factory PenangananItem.fromJson(Map<String, dynamic> json) {
    return PenangananItem(
      judulPenanganan: json['judul_penanganan'] ?? '',
      deskripsiPenanganan: json['deskripsi_penanganan'] ?? '',
    );
  }
}
