const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    createPengguna,
    getPenggunaByEmail,
    getPenggunaById,
    updateFotoProfil,
} = require("../models/penggunaModel");

const register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        if (!nama || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Nama, email, dan password wajib diisi",
            });
        }

        const existingUser = await getPenggunaByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id_pengguna = await createPengguna(nama, email, hashedPassword);

        const token = jwt.sign(
            { id: id_pengguna, nama, email, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: { id_pengguna, nama, email, role: "user", foto_profil: null, token },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registrasi gagal",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email dan password wajib diisi",
            });
        }

        const user = await getPenggunaByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        const token = jwt.sign(
            { id: user.id_pengguna, nama: user.nama, email: user.email, role: user.role || "user" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login berhasil",
            data: {
                id_pengguna: user.id_pengguna,
                nama: user.nama,
                email: user.email,
                role: user.role || "user",
                foto_profil: user.foto_profil || null,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login gagal",
            error: error.message,
        });
    }
};

const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File foto tidak ditemukan",
            });
        }

        const userId = req.user.id;
        const filename = req.file.filename;

        await updateFotoProfil(userId, filename);

        const updatedUser = await getPenggunaById(userId);

        res.status(200).json({
            success: true,
            message: "Foto profil berhasil diperbarui",
            data: {
                id_pengguna: updatedUser.id_pengguna,
                nama: updatedUser.nama,
                email: updatedUser.email,
                role: updatedUser.role,
                foto_profil: updatedUser.foto_profil,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengupload foto profil",
            error: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await getPenggunaById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil profil", error: error.message });
    }
};

module.exports = { register, login, uploadProfilePhoto, getProfile };
