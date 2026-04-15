const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const penyakitRoutes = require("./routes/penyakitRoutes");
const penangananRoutes = require("./routes/penangananRoutes");
const deteksiRoutes = require("./routes/deteksiRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend Deteksi Penyakit Tanaman berjalan",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/penyakit", penyakitRoutes);
app.use("/api/penanganan", penangananRoutes);
app.use("/api/deteksi", deteksiRoutes);

// Global Error Handler to guarantee JSON responses
app.use((err, req, res, next) => {
    console.error("Global Error Handler caught:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Terjadi kesalahan pada server",
        error: err.toString()
    });
});

module.exports = app;