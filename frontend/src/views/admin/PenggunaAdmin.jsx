import { useState, useEffect } from "react";
import { adminGetPengguna, adminUpdatePengguna, adminDeletePengguna } from "../../services/api";

function PenggunaAdmin() {
    const [data, setData] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ nama: "", email: "", role: "user" });

    const load = async () => { try { setData(await adminGetPengguna()); } catch (e) { alert(e.message); } };
    useEffect(() => { load(); }, []);

    const handleEdit = (item) => { setEditing(item.id_pengguna); setForm({ nama: item.nama, email: item.email, role: item.role }); };
    const handleSave = async () => {
        try { await adminUpdatePengguna(editing, form); setEditing(null); load(); } catch (e) { alert(e.response?.data?.message || e.message); }
    };
    const handleDelete = async (id) => {
        if (!confirm("Hapus pengguna ini?")) return;
        try { await adminDeletePengguna(id); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div style={pg.page}>
            <h2 style={pg.title}>Kelola Pengguna</h2>
            <div className="admin-table-wrap" style={pg.tableWrap}>
                <table style={pg.table}>
                    <thead>
                        <tr>{["ID", "Nama", "Email", "Role", "Aksi"].map(h => <th key={h} style={pg.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id_pengguna}>
                                <td style={pg.td}>{item.id_pengguna}</td>
                                <td style={pg.td}>{editing === item.id_pengguna ? <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} style={pg.input} /> : item.nama}</td>
                                <td style={pg.td}>{editing === item.id_pengguna ? <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={pg.input} /> : item.email}</td>
                                <td style={pg.td}>{editing === item.id_pengguna ? (
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={pg.input}>
                                        <option value="user">user</option><option value="admin">admin</option>
                                    </select>
                                ) : <span style={{ ...pg.badge, background: item.role === "admin" ? "#dbeafe" : "#f0fdf4", color: item.role === "admin" ? "#1d4ed8" : "#15803d" }}>{item.role}</span>}</td>
                                <td style={pg.td}>
                                    {editing === item.id_pengguna ? (
                                        <><button onClick={handleSave} style={pg.saveBtn}>Simpan</button><button onClick={() => setEditing(null)} style={pg.cancelBtn}>Batal</button></>
                                    ) : (
                                        <><button onClick={() => handleEdit(item)} style={pg.editBtn}>Edit</button><button onClick={() => handleDelete(item.id_pengguna)} style={pg.delBtn}>Hapus</button></>
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
    title: { fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "20px" },
    tableWrap: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 14px", fontSize: "12px", fontWeight: "700", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", textTransform: "uppercase" },
    td: { padding: "10px 14px", fontSize: "14px", color: "#374151", borderBottom: "1px solid #f3f4f6" },
    input: { padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", width: "100%", fontFamily: "inherit" },
    badge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
    editBtn: { padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#fff", color: "#374151", fontSize: "12px", cursor: "pointer", marginRight: "4px" },
    delBtn: { padding: "4px 12px", border: "1px solid #fca5a5", borderRadius: "6px", background: "#fef2f2", color: "#dc2626", fontSize: "12px", cursor: "pointer" },
    saveBtn: { padding: "4px 12px", border: "none", borderRadius: "6px", background: "#15803d", color: "#fff", fontSize: "12px", cursor: "pointer", marginRight: "4px" },
    cancelBtn: { padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#fff", color: "#6b7280", fontSize: "12px", cursor: "pointer" },
};

export default PenggunaAdmin;
