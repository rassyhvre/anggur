import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRiwayat } from "../../services/api";
import RiwayatCard from "./components/RiwayatCard";
import RiwayatDetailModal from "./components/RiwayatDetailModal";

function RiwayatPage() {
    const [riwayat, setRiwayat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRiwayat = async () => {
            try {
                const data = await getRiwayat();
                setRiwayat(data);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat riwayat deteksi");
            } finally { setLoading(false); }
        };
        fetchRiwayat();
    }, []);

    return (
        <div style={s.page}>
            <section style={s.headerSection}>
                <p style={s.eyebrow}>Riwayat</p>
                <h1 style={s.title}>Riwayat Diagnosis</h1>
                <p style={s.subtitle}>Semua hasil diagnosis penyakit tanaman Anda tersimpan di sini</p>
            </section>

            <div style={s.container}>
                {loading && <p style={s.status}>Memuat riwayat...</p>}
                {error && <p style={{ ...s.status, color: "#dc2626" }}>{error}</p>}

                {!loading && !error && riwayat.length === 0 && (
                    <div style={s.empty}>
                        <span style={{ fontSize: "48px" }}>📭</span>
                        <h3 style={s.emptyTitle}>Belum ada riwayat</h3>
                        <p style={s.emptyDesc}>Mulai diagnosis pertama Anda untuk melihat hasilnya di sini</p>
                        <button onClick={() => navigate("/scan")} style={s.emptyBtn}>
                            Mulai Scan →
                        </button>
                    </div>
                )}

                <div style={s.list}>
                    {riwayat.map((item) => (
                        <RiwayatCard 
                            key={item.id_deteksi} 
                            item={item} 
                            onClick={() => setSelectedId(item.id_deteksi)}
                        />
                    ))}
                </div>

                <RiwayatDetailModal 
                    id={selectedId} 
                    onClose={() => setSelectedId(null)} 
                />
            </div>

            <footer style={s.footer}>
                <p style={s.footerText}>© 2026 AgroScan. Deteksi penyakit tanaman berbasis AI.</p>
            </footer>
        </div>
    );
}

const s = {
    page: { minHeight: "100vh", background: "#fff" },
    headerSection: {
        textAlign: "center",
        padding: "120px 24px 48px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
    },
    eyebrow: {
        color: "#16a34a", fontSize: "13px", fontWeight: "700",
        textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px",
    },
    title: { fontSize: "34px", fontWeight: "800", color: "#111827", marginBottom: "8px", letterSpacing: "-0.3px" },
    subtitle: { fontSize: "15px", color: "#6b7280" },
    container: { maxWidth: "600px", margin: "0 auto", padding: "0 24px 60px" },
    status: { textAlign: "center", color: "#6b7280", padding: "40px 0" },
    empty: {
        textAlign: "center", padding: "60px 24px",
        border: "1px solid #f3f4f6", borderRadius: "16px", background: "#fafafa",
    },
    emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "16px 0 8px" },
    emptyDesc: { fontSize: "14px", color: "#6b7280", marginBottom: "24px" },
    emptyBtn: {
        padding: "12px 28px", border: "none", borderRadius: "10px",
        background: "#16a34a", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
    },
    list: { display: "flex", flexDirection: "column", gap: "12px" },
    footer: { borderTop: "1px solid #f3f4f6", padding: "28px 24px", textAlign: "center" },
    footerText: { fontSize: "13px", color: "#9ca3af" },
};

export default RiwayatPage;
