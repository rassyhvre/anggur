const express = require("express");
const router = express.Router();
const deteksiController = require("../controllers/deteksiController");
const upload = require("../middlewares/uploadMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/upload", upload.single("gambar"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File gambar tidak ditemukan",
            });
        }

        res.status(200).json({
            success: true,
            message: "Upload gambar berhasil",
            data: {
                filename: req.file.filename,
                path: `uploads/${req.file.filename}`,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Upload gambar gagal",
            error: error.message,
        });
    }
});

router.post("/predict", verifyToken, upload.single("file"), deteksiController.deteksiAI);

router.post("/", deteksiController.simpanDeteksi);
router.get("/riwayat", verifyToken, deteksiController.riwayatDeteksi);
router.get("/stats", verifyToken, deteksiController.statsDeteksi);
router.get("/:id", deteksiController.detailDeteksi);
router.delete("/:id", verifyToken, deteksiController.hapusDeteksi);

module.exports = router;