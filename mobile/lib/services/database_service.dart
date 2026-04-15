import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/deteksi_result_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  static Database? _database;

  factory DatabaseService() {
    return _instance;
  }

  DatabaseService._internal();

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'kingscan.db');

    return openDatabase(
      path,
      version: 2,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE deteksi_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_pengguna INTEGER,
        imagePath TEXT NOT NULL,
        namaGambar TEXT,
        resultPenyakit TEXT,
        confidence REAL,
        rekomendasi TEXT,
        waktu TEXT NOT NULL
      )
    ''');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await db.execute('ALTER TABLE deteksi_results ADD COLUMN id_pengguna INTEGER');
    }
  }

  Future<int> insertDeteksiResult(DeteksiResult result) async {
    final db = await database;
    return db.insert('deteksi_results', result.toMap());
  }

  Future<List<DeteksiResult>> getAllDeteksiResults(int idPengguna) async {
    final db = await database;
    final results = await db.query(
      'deteksi_results',
      where: 'id_pengguna = ?',
      whereArgs: [idPengguna],
      orderBy: 'waktu DESC',
    );
    return results.map((map) => DeteksiResult.fromMap(map)).toList();
  }

  Future<DeteksiResult?> getDeteksiResultById(int id) async {
    final db = await database;
    final results = await db.query(
      'deteksi_results',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (results.isNotEmpty) {
      return DeteksiResult.fromMap(results.first);
    }
    return null;
  }

  Future<int> deleteDeteksiResult(int id) async {
    final db = await database;
    return db.delete(
      'deteksi_results',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<int> deleteAllDeteksiResults() async {
    final db = await database;
    return db.delete('deteksi_results');
  }

  Future<int> getCount() async {
    final db = await database;
    final result = await db.rawQuery('SELECT COUNT(*) as count FROM deteksi_results');
    return Sqflite.firstIntValue(result) ?? 0;
  }
}
