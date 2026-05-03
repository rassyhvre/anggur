const express = require("express");
const router = express.Router();
const deteksiController = require("../controllers/deteksiController");
const upload = require("../middlewares/uploadMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");


router.post("/predict", verifyToken, upload.single("file"), deteksiController.deteksiAI);

router.post("/", deteksiController.simpanDeteksi);
router.get("/riwayat", verifyToken, deteksiController.riwayatDeteksi);
router.get("/stats", verifyToken, deteksiController.statsDeteksi);
router.get("/:id", deteksiController.detailDeteksi);
router.delete("/:id", verifyToken, deteksiController.hapusDeteksi);

module.exports = router;