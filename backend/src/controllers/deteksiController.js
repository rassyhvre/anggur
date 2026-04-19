const {
    createHasilDeteksi,
    getRiwayatDeteksi,
    getDeteksiById,
    deleteHasilDeteksi,
} = require("../models/hasilDeteksiModel");
const { getPenyakitByNama } = require("../models/penyakitModel");
const { getPenangananByPenyakitId } = require("../models/penangananModel");
const aiService = require("../services/aiService");

const simpanDeteksi = async (req, res) => {
    try {
        const { id_pengguna, id_penyakit, gambar_upload, tingkat_keyakinan } = req.body;

        const insertId = await createHasilDeteksi({
            id_pengguna,
            id_penyakit,
            gambar_upload,
            tingkat_keyakinan,
        });

        res.status(201).json({
            success: true,
            message: "Hasil deteksi berhasil disimpan",
            data: {
                id_deteksi: insertId,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menyimpan hasil deteksi",
            error: error.message,
        });
    }
};

const riwayatDeteksi = async (req, res) => {
    try {
        const data = await getRiwayatDeteksi(req.user.id);

        res.status(200).json({
            success: true,
            message: "Riwayat deteksi berhasil diambil",
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil riwayat deteksi",
            error: error.message,
        });
    }
};

const detailDeteksi = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getDeteksiById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Data deteksi tidak ditemukan",
            });
        }

        // Ambil penanganan dari database berdasarkan id_penyakit
        const penanganan = await getPenangananByPenyakitId(data.id_penyakit);

        // Konversi RowDataPacket ke plain object agar spread operator berfungsi
        const plainData = JSON.parse(JSON.stringify(data));

        res.status(200).json({
            success: true,
            message: "Detail deteksi berhasil diambil",
            data: {
                ...plainData,
                penanganan,
            },
        });
    } catch (error) {
        console.error("Error detailDeteksi:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil detail deteksi",
            error: error.message,
        });
    }
};

const deteksiAI = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Gambar tidak ditemukan",
            });
        }

        const imagePath = req.file.path;

        // 1. Kirim gambar ke AI server
        const aiResult = await aiService.predictImage(imagePath);

        // 2. Cek apakah gambar adalah daun anggur (filter model)
        if (aiResult.is_grape_leaf === false) {
            return res.status(400).json({
                success: false,
                is_grape_leaf: false,
                filter_confidence: aiResult.filter_confidence,
                message: aiResult.message || "Gambar yang diunggah bukan daun anggur. Silakan unggah foto daun anggur untuk deteksi penyakit.",
            });
        }

        // 3. Cari id_penyakit berdasarkan nama dari AI
        const penyakit = await getPenyakitByNama(aiResult.penyakit);

        if (!penyakit) {
            return res.status(404).json({
                success: false,
                message: `Penyakit "${aiResult.penyakit}" tidak ditemukan di database`,
            });
        }

        // 4. Simpan hasil deteksi ke database
        const id_deteksi = await createHasilDeteksi({
            id_pengguna: req.user.id,
            id_penyakit: penyakit.id_penyakit,
            gambar_upload: req.file.filename,
            tingkat_keyakinan: aiResult.confidence,
        });

        // 5. Ambil daftar penanganan berdasarkan id_penyakit
        const penanganan = await getPenangananByPenyakitId(penyakit.id_penyakit);

        // 6. Return response lengkap
        res.status(201).json({
            success: true,
            message: "Deteksi berhasil",
            data: {
                id_deteksi,
                penyakit: aiResult.penyakit,
                confidence: aiResult.confidence,
                penanganan,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Deteksi gagal",
            error: error.message,
        });
    }
};

const hapusDeteksi = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteHasilDeteksi(id);
        res.status(200).json({
            success: true,
            message: "Riwayat deteksi berhasil dihapus",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menghapus riwayat deteksi",
            error: error.message,
        });
    }
};

const statsDeteksi = async (req, res) => {
    try {
        const data = await getRiwayatDeteksi(req.user.id);
        const total = data.length;
        const sehat = data.filter(d => d.nama_penyakit && d.nama_penyakit.toLowerCase() === 'healthy').length;
        const terinfeksi = total - sehat;
        res.status(200).json({
            success: true,
            data: { total, sehat, terinfeksi },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik",
            error: error.message,
        });
    }
};

module.exports = {
    simpanDeteksi,
    riwayatDeteksi,
    detailDeteksi,
    deteksiAI,
    hapusDeteksi,
    statsDeteksi,
};