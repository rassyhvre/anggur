import { useState, useEffect } from "react";
import { adminGetDeteksi, adminDeleteDeteksi } from "../../services/api";

function DeteksiAdmin() {
    const [data, setData] = useState([]);

    const load = async () => { try { setData(await adminGetDeteksi()); } catch (e) { alert(e.message); } };
    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Hapus hasil deteksi ini?")) return;
        try { await adminDeleteDeteksi(id); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div style={pg.page}>
            <h2 style={pg.title}>Kelola Hasil Deteksi</h2>
            <div className="admin-table-wrap" style={pg.tableWrap}>
                <table style={pg.table}>
                    <thead>
                        <tr>{["ID", "Gambar", "Penyakit", "Keyakinan", "Pengguna", "Tanggal", "Aksi"].map(h => <th key={h} style={pg.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id_deteksi}>
                                <td style={pg.td}>{item.id_deteksi}</td>
                                <td style={pg.td}>
                                    <img src={`http://localhost:5000/uploads/${item.gambar_upload}`} alt="" style={pg.img} />
                                </td>
                                <td style={pg.td}>{item.nama_penyakit}</td>
                                <td style={pg.td}>{(item.tingkat_keyakinan * 100).toFixed(1)}%</td>
                                <td style={pg.td}>{item.nama_pengguna || "-"}<br /><span style={pg.email}>{item.email || ""}</span></td>
                                <td style={pg.td}>{new Date(item.tanggal_deteksi).toLocaleDateString("id-ID")}</td>
                                <td style={pg.td}>
                                    <button onClick={() => handleDelete(item.id_deteksi)} style={pg.delBtn}>Hapus</button>
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
    title: { fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "20px" },
    tableWrap: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 14px", fontSize: "12px", fontWeight: "700", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", textTransform: "uppercase" },
    td: { padding: "10px 14px", fontSize: "14px", color: "#374151", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
    img: { width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" },
    email: { color: "#9ca3af", fontSize: "12px" },
    delBtn: { padding: "4px 12px", border: "1px solid #fca5a5", borderRadius: "6px", background: "#fef2f2", color: "#dc2626", fontSize: "12px", cursor: "pointer" },
};

export default DeteksiAdmin;
