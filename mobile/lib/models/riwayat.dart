class Riwayat {
  final int idDeteksi;
  final String namaPenyakit;
  final String gambarUpload;
  final double tingkatKeyakinan;
  final String tanggalDeteksi;

  Riwayat({
    required this.idDeteksi,
    required this.namaPenyakit,
    required this.gambarUpload,
    required this.tingkatKeyakinan,
    required this.tanggalDeteksi,
  });

  factory Riwayat.fromJson(Map<String, dynamic> json) {
    return Riwayat(
      idDeteksi: json['id_deteksi'],
      namaPenyakit: json['nama_penyakit'] ?? json['penyakit'] ?? '',
      gambarUpload: json['gambar_upload'] ?? '',
      tingkatKeyakinan: (json['tingkat_keyakinan'] ?? 0).toDouble(),
      tanggalDeteksi: json['tanggal_deteksi'] ?? '',
    );
  }
}
