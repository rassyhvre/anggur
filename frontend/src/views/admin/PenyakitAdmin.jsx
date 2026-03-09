import { useState, useEffect } from "react";
import { adminGetPenyakit, adminCreatePenyakit, adminUpdatePenyakit, adminDeletePenyakit } from "../../services/api";

function PenyakitAdmin() {
    const [data, setData] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ nama_penyakit: "", deskripsi: "" });
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ nama_penyakit: "", deskripsi: "" });

    const load = async () => { try { setData(await adminGetPenyakit()); } catch (e) { alert(e.message); } };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!addForm.nama_penyakit) { alert("Nama penyakit wajib diisi"); return; }
        try { await adminCreatePenyakit(addForm); setShowAdd(false); setAddForm({ nama_penyakit: "", deskripsi: "" }); load(); } catch (e) { alert(e.message); }
    };
    const handleEdit = (item) => { setEditing(item.id_penyakit); setForm({ nama_penyakit: item.nama_penyakit, deskripsi: item.deskripsi || "" }); };
    const handleSave = async () => {
        try { await adminUpdatePenyakit(editing, form); setEditing(null); load(); } catch (e) { alert(e.message); }
    };
    const handleDelete = async (id) => {
        if (!confirm("Hapus penyakit ini?")) return;
        try { await adminDeletePenyakit(id); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div style={pg.page}>
            <div style={pg.headerRow}>
                <h2 style={pg.title}>Kelola Penyakit</h2>
                <button onClick={() => setShowAdd(!showAdd)} style={pg.addBtn}>{showAdd ? "✕ Batal" : "＋ Tambah"}</button>
            </div>

            {showAdd && (
                <div style={pg.addCard}>
                    <input value={addForm.nama_penyakit} onChange={e => setAddForm({ ...addForm, nama_penyakit: e.target.value })} placeholder="Nama penyakit" style={pg.input} />
                    <textarea value={addForm.deskripsi} onChange={e => setAddForm({ ...addForm, deskripsi: e.target.value })} placeholder="Deskripsi" style={{ ...pg.input, minHeight: "60px" }} />
                    <button onClick={handleAdd} style={pg.saveBtn}>Simpan</button>
                </div>
            )}

            <div className="admin-table-wrap" style={pg.tableWrap}>
                <table style={pg.table}>
                    <thead><tr>{["ID", "Nama Penyakit", "Deskripsi", "Aksi"].map(h => <th key={h} style={pg.th}>{h}</th>)}</tr></thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id_penyakit}>
                                <td style={pg.td}>{item.id_penyakit}</td>
                                <td style={pg.td}>{editing === item.id_penyakit ? <input value={form.nama_penyakit} onChange={e => setForm({ ...form, nama_penyakit: e.target.value })} style={pg.input} /> : item.nama_penyakit}</td>
                                <td style={pg.tdDesc}>{editing === item.id_penyakit ? <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} style={{ ...pg.input, minHeight: "50px" }} /> : (item.deskripsi || "-")}</td>
                                <td style={pg.td}>
                                    {editing === item.id_penyakit ? (
                                        <><button onClick={handleSave} style={pg.saveBtn}>Simpan</button><button onClick={() => setEditing(null)} style={pg.cancelBtn}>Batal</button></>
                                    ) : (
                                        <><button onClick={() => handleEdit(item)} style={pg.editBtn}>Edit</button><button onClick={() => handleDelete(item.id_penyakit)} style={pg.delBtn}>Hapus</button></>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const pg = {
    page: { maxWidth: "900px", margin: "0 auto", padding: "32px 20px" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "22px", fontWeight: "800", color: "#111827", margin: 0 },
    addBtn: { padding: "8px 18px", border: "none", borderRadius: "8px", background: "#15803d", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
    addCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "10px" },
    tableWrap: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 14px", fontSize: "12px", fontWeight: "700", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", textTransform: "uppercase" },
    td: { padding: "10px 14px", fontSize: "14px", color: "#374151", borderBottom: "1px solid #f3f4f6" },
    tdDesc: { padding: "10px 14px", fontSize: "13px", color: "#6b7280", borderBottom: "1px solid #f3f4f6", maxWidth: "300px" },
    input: { padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", width: "100%", fontFamily: "inherit", resize: "vertical" },
    editBtn: { padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#fff", color: "#374151", fontSize: "12px", cursor: "pointer", marginRight: "4px" },
    delBtn: { padding: "4px 12px", border: "1px solid #fca5a5", borderRadius: "6px", background: "#fef2f2", color: "#dc2626", fontSize: "12px", cursor: "pointer" },
    saveBtn: { padding: "6px 14px", border: "none", borderRadius: "6px", background: "#15803d", color: "#fff", fontSize: "13px", cursor: "pointer", marginRight: "4px", fontWeight: "600" },
    cancelBtn: { padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#fff", color: "#6b7280", fontSize: "12px", cursor: "pointer" },
};

export default PenyakitAdmin;
