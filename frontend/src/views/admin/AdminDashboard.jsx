import { useEffect, useState } from "react";
import { adminGetPengguna, adminGetPenyakit, adminGetPenanganan, adminGetDeteksi } from "../../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState({ pengguna: 0, penyakit: 0, penanganan: 0, deteksi: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [p1, p2, p3, p4] = await Promise.all([
                    adminGetPengguna(), adminGetPenyakit(), adminGetPenanganan(), adminGetDeteksi(),
                ]);
                setStats({ pengguna: p1.length, penyakit: p2.length, penanganan: p3.length, deteksi: p4.length });
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    const cards = [
        { label: "Pengguna", count: stats.pengguna, icon: "👥", color: "#3b82f6" },
        { label: "Penyakit", count: stats.penyakit, icon: "🦠", color: "#ef4444" },
        { label: "Penanganan", count: stats.penanganan, icon: "💊", color: "#22c55e" },
        { label: "Hasil Deteksi", count: stats.deteksi, icon: "🔬", color: "#f59e0b" },
    ];

    return (
        <div style={s.page}>
            <h1 style={s.title}>Dashboard Admin</h1>
            <p style={s.subtitle}>Selamat datang di panel administrasi AgroScan</p>
            <div className="admin-grid" style={s.grid}>
                {cards.map((c) => (
                    <div key={c.label} style={s.card}>
                        <div style={{ ...s.iconWrap, background: c.color + "20", color: c.color }}>{c.icon}</div>
                        <div>
                            <p style={s.count}>{c.count}</p>
                            <p style={s.label}>{c.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const s = {
    page: { maxWidth: "900px", margin: "0 auto", padding: "32px 20px" },
    title: { fontSize: "24px", fontWeight: "800", color: "#111827", margin: "0 0 4px" },
    subtitle: { color: "#6b7280", fontSize: "14px", margin: "0 0 28px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" },
    card: {
        display: "flex", alignItems: "center", gap: "16px",
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "20px",
    },
    iconWrap: {
        width: "48px", height: "48px", borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
    },
    count: { fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0" },
    label: { fontSize: "13px", color: "#6b7280", margin: "0" },
};

export default AdminDashboard;
