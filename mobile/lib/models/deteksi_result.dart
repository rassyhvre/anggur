class DeteksiResult {
  final int idDeteksi;
  final String penyakit;
  final double confidence;
  final List<Penanganan> penanganan;

  DeteksiResult({
    required this.idDeteksi,
    required this.penyakit,
    required this.confidence,
    required this.penanganan,
  });

  factory DeteksiResult.fromJson(Map<String, dynamic> json) {
    return DeteksiResult(
      idDeteksi: json['id_deteksi'],
      penyakit: json['penyakit'] ?? '',
      confidence: (json['confidence'] ?? 0).toDouble(),
      penanganan: (json['penanganan'] as List<dynamic>?)
              ?.map((e) => Penanganan.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class Penanganan {
  final String judulPenanganan;
  final String deskripsiPenanganan;

  Penanganan({
    required this.judulPenanganan,
    required this.deskripsiPenanganan,
  });

  factory Penanganan.fromJson(Map<String, dynamic> json) {
    return Penanganan(
      judulPenanganan: json['judul_penanganan'] ?? '',
      deskripsiPenanganan: json['deskripsi_penanganan'] ?? '',
    );
  }
}
