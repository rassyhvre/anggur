class Pengguna {
  final int idPengguna;
  final String nama;
  final String email;
  final String role;

  Pengguna({
    required this.idPengguna,
    required this.nama,
    required this.email,
    required this.role,
  });

  factory Pengguna.fromJson(Map<String, dynamic> json) {
    return Pengguna(
      idPengguna: json['id_pengguna'],
      nama: json['nama'],
      email: json['email'],
      role: json['role'] ?? 'user',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_pengguna': idPengguna,
      'nama': nama,
      'email': email,
      'role': role,
    };
  }
}
