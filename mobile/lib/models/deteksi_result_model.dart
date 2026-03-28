class DeteksiResult {
  final int? id;
  final String imagePath;
  final String? namaGambar;
  final String? resultPenyakit;
  final double? confidence;
  final String? rekomendasi;
  final DateTime waktu;

  DeteksiResult({
    this.id,
    required this.imagePath,
    this.namaGambar,
    this.resultPenyakit,
    this.confidence,
    this.rekomendasi,
    required this.waktu,
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
}
