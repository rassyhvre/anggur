const db = require("../config/db");

const getAllPenyakit = async () => {
    const [rows] = await db.query("SELECT * FROM penyakit ORDER BY id_penyakit ASC");
    return rows;
};

const getPenyakitById = async (id) => {
    const [rows] = await db.query("SELECT * FROM penyakit WHERE id_penyakit = ?", [id]);
    return rows[0];
};

const getPenyakitByNama = async (namaPenyakit) => {
    const [rows] = await db.query("SELECT * FROM penyakit WHERE LOWER(nama_penyakit) = LOWER(?)", [namaPenyakit]);
    return rows[0];
};

const createPenyakit = async ({ nama_penyakit, deskripsi }) => {
    const [result] = await db.query(
        "INSERT INTO penyakit (nama_penyakit, deskripsi) VALUES (?, ?)",
        [nama_penyakit, deskripsi]
    );
    return result.insertId;
};

const updatePenyakit = async (id, { nama_penyakit, deskripsi }) => {
    await db.query(
        "UPDATE penyakit SET nama_penyakit = ?, deskripsi = ? WHERE id_penyakit = ?",
        [nama_penyakit, deskripsi, id]
    );
};

const deletePenyakit = async (id) => {
    await db.query("DELETE FROM penyakit WHERE id_penyakit = ?", [id]);
};

module.exports = {
    getAllPenyakit,
    getPenyakitById,
    getPenyakitByNama,
    createPenyakit,
    updatePenyakit,
    deletePenyakit,
};
