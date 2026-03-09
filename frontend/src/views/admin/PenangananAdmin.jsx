import { useState, useEffect } from "react";
import { adminGetPenanganan, adminCreatePenanganan, adminUpdatePenanganan, adminDeletePenanganan, adminGetPenyakit } from "../../services/api";

function PenangananAdmin() {
    const [data, setData] = useState([]);
    const [penyakitList, setPenyakitList] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ id_penyakit: "", judul_penanganan: "", deskripsi_penanganan: "" });
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ id_penyakit: "", judul_penanganan: "", deskripsi_penanganan: "" });

    const load = async () => {
        try {
            const [penanganan, penyakit] = await Promise.all([adminGetPenanganan(), adminGetPenyakit()]);
            setData(penanganan);
            setPenyakitList(penyakit);
        } catch (e) { alert(e.message); }
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!addForm.id_penyakit || !addForm.judul_penanganan) { alert("Penyakit dan judul wajib diisi"); return; }
        try { await adminCreatePenanganan(addForm); setShowAdd(false); setAddForm({ id_penyakit: "", judul_penanganan: "", deskripsi_penanganan: "" }); load(); } catch (e) { alert(e.message); }
    };
    const handleEdit = (item) => { setEditing(item.id_penanganan); setForm({ id_penyakit: item.id_penyakit, judul_penanganan: item.judul_penanganan, deskripsi_penanganan: item.deskripsi_penanganan || "" }); };
    const handleSave = async () => {
        try { await adminUpdatePenanganan(editing, form); setEditing(null); load(); } catch (e) { alert(e.message); }
    };
    const handleDelete = async (id) => {
        if (!confirm("Hapus penanganan ini?")) return;
        try { await adminDeletePenanganan(id); load(); } catch (e) { alert(e.message); }
    };

    const PenyakitSelect = ({ value, onChange }) => (
        <select value={value} onChange={onChange} style={pg.input}>
            <option value="">Pilih Penyakit</option>
            {penyakitList.map(p => <option key={p.id_penyakit} value={p.id_penyakit}>{p.nama_penyakit}</option>)}
        </select>
    );

    return (
        <div style={pg.page}>
            <div style={pg.headerRow}>
                <h2 style={pg.title}>Kelola Penanganan</h2>
                <button onClick={() => setShowAdd(!showAdd)} style={pg.addBtn}>{showAdd ? "✕ Batal" : "＋ Tambah"}</button>
            </div>

            {showAdd && (
                <div style={pg.addCard}>
                    <PenyakitSelect value={addForm.id_penyakit} onChange={e => setAddForm({ ...addForm, id_penyakit: e.target.value })} />
                    <input value={addForm.judul_penanganan} onChange={e => setAddForm({ ...addForm, judul_penanganan: e.target.value })} placeholder="Judul penanganan" style={pg.input} />
                    <textarea value={addForm.deskripsi_penanganan} onChange={e => setAddForm({ ...addForm, deskripsi_penanganan: e.target.value })} placeholder="Deskripsi penanganan" style={{ ...pg.input, minHeight: "60px" }} />
                    <button onClick={handleAdd} style={pg.saveBtn}>Simpan</button>
                </div>
            )}

            <div className="admin-table-wrap" style={pg.tableWrap}>
                <table style={pg.table}>
                    <thead><tr>{["ID", "Penyakit", "Judul", "Deskripsi", "Aksi"].map(h => <th key={h} style={pg.th}>{h}</th>)}</tr></thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id_penanganan}>
                                <td style={pg.td}>{item.id_penanganan}</td>
                                <td style={pg.td}>{editing === item.id_penanganan ? <PenyakitSelect value={form.id_penyakit} onChange={e => setForm({ ...form, id_penyakit: e.target.value })} /> : item.nama_penyakit}</td>
                                <td style={pg.td}>{editing === item.id_penanganan ? <input value={form.judul_penanganan} onChange={e => setForm({ ...form, judul_penanganan: e.target.value })} style={pg.input} /> : item.judul_penanganan}</td>
                                <td style={pg.tdDesc}>{editing === item.id_penanganan ? <textarea value={form.deskripsi_penanganan} onChange={e => setForm({ ...form, deskripsi_penanganan: e.target.value })} style={{ ...pg.input, minHeight: "50px" }} /> : (item.deskripsi_penanganan || "-")}</td>
                                <td style={pg.td}>
                                    {editing === item.id_penanganan ? (
                                        <><button onClick={handleSave} style={pg.saveBtn}>Simpan</button><button onClick={() => setEditing(null)} style={pg.cancelBtn}>Batal</button></>
                                    ) : (
                                        <><button onClick={() => handleEdit(item)} style={pg.editBtn}>Edit</button><button onClick={() => handleDelete(item.id_penanganan)} style={pg.delBtn}>Hapus</button></>
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
    page: { maxWidth: "1000px", margin: "0 auto", padding: "32px 20px" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "22px", fontWeight: "800", color: "#111827", margin: 0 },
    addBtn: { padding: "8px 18px", border: "none", borderRadius: "8px", background: "#15803d", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
    addCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "10px" },
    tableWrap: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 14px", fontSize: "12px", fontWeight: "700", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", textTransform: "uppercase" },
    td: { padding: "10px 14px", fontSize: "14px", color: "#374151", borderBottom: "1px solid #f3f4f6" },
    tdDesc: { padding: "10px 14px", fontSize: "13px", color: "#6b7280", borderBottom: "1px solid #f3f4f6", maxWidth: "250px" },
    input: { padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", width: "100%", fontFamily: "inherit", resize: "vertical" },
    editBtn: { padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#fff", color: "#374151", fontSize: "12px", cursor: "pointer", marginRight: "4px" },
    delBtn: { padding: "4px 12px", border: "1px solid #fca5a5", borderRadius: "6px", background: "#fef2f2", color: "#dc2626", fontSize: "12px", cursor: "pointer" },
    saveBtn: { padding: "6px 14px", border: "none", borderRadius: "6px", background: "#15803d", color: "#fff", fontSize: "13px", cursor: "pointer", marginRight: "4px", fontWeight: "600" },
    cancelBtn: { padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#fff", color: "#6b7280", fontSize: "12px", cursor: "pointer" },
};

export default PenangananAdmin;
