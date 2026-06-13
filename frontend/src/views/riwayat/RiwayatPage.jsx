import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRiwayat } from "../../services/api";
import RiwayatCard from "./components/RiwayatCard";

function RiwayatPage() {
    const [riwayat, setRiwayat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                <div style={s.headerBlob1} />
                <div style={s.headerBlob2} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={s.eyebrow} className="animate-fade-in-up">RIWAYAT</span>
                    <h1 style={s.title} className="animate-fade-in-up delay-1">Riwayat Diagnosis</h1>
                    <p style={s.subtitle} className="animate-fade-in-up delay-2">
                        Semua hasil diagnosis penyakit tanaman Anda tersimpan di sini
                    </p>
                </div>
            </section>

            <div style={s.container}>
                {loading && (
                    <div style={s.loadingWrap}>
                        <div style={s.spinner} />
                        <p style={s.status}>Memuat riwayat...</p>
                    </div>
                )}
                {error && <p style={{ ...s.status, color: "#dc2626" }}>{error}</p>}

                {!loading && !error && riwayat.length === 0 && (
                    <div style={s.empty} className="animate-scale-in">
                        <div style={s.emptyIconWrap}>
                            <span style={{ fontSize: "48px" }}>📭</span>
                        </div>
                        <h3 style={s.emptyTitle}>Belum ada riwayat</h3>
                        <p style={s.emptyDesc}>Mulai diagnosis pertama Anda untuk melihat hasilnya di sini</p>
                        <button onClick={() => navigate("/scan")} style={s.emptyBtn}
                            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 28px -6px rgba(22,163,74,0.4)"; }}
                            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 16px -4px rgba(22,163,74,0.3)"; }}>
                            🔬 Mulai Scan →
                        </button>
                    </div>
                )}

                <div style={s.list}>
                    {riwayat.map((item, i) => (
                        <div key={item.id_deteksi} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                            <RiwayatCard item={item} />
                        </div>
                    ))}
                </div>
            </div>

            <footer style={s.footer}>
                <p style={s.footerText}>© 2026 AgroScan. Deteksi penyakit tanaman berbasis AI.</p>
            </footer>
        </div>
    );
}

const s = {
    page: { minHeight: "100vh", background: "#fafbfc" },
    headerSection: {
        textAlign: "center",
        padding: "120px 24px 56px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #fafbfc 100%)",
        position: "relative", overflow: "hidden",
    },
    headerBlob1: {
        position: "absolute", width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        top: "-80px", right: "10%", borderRadius: "50%",
        animation: "blob 8s ease-in-out infinite",
    },
    headerBlob2: {
        position: "absolute", width: "200px", height: "200px",
        background: "radial-gradient(circle, rgba(126,34,206,0.06) 0%, transparent 70%)",
        bottom: "-30px", left: "5%", borderRadius: "50%",
        animation: "blob 10s ease-in-out infinite reverse",
    },
    eyebrow: {
        display: "inline-block", padding: "7px 18px",
        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
        color: "#15803d", fontSize: "13px", fontWeight: "800",
        borderRadius: "20px", letterSpacing: "1.5px", marginBottom: "16px",
    },
    title: {
        fontSize: "38px", fontWeight: "800", color: "#0f172a",
        marginBottom: "12px", letterSpacing: "-0.8px",
    },
    subtitle: { fontSize: "16px", color: "#64748b" },
    container: { maxWidth: "640px", margin: "0 auto", padding: "0 24px 80px" },
    loadingWrap: {
        textAlign: "center", padding: "60px 0",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
    },
    spinner: {
        width: "40px", height: "40px", borderRadius: "50%",
        border: "3px solid #e2e8f0", borderTopColor: "#16a34a",
        animation: "spin-slow 0.8s linear infinite",
    },
    status: { textAlign: "center", color: "#64748b", padding: "40px 0", fontSize: "15px" },
    empty: {
        textAlign: "center", padding: "60px 24px",
        border: "1px solid rgba(0,0,0,0.04)", borderRadius: "24px",
        background: "#ffffff",
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.05)",
    },
    emptyIconWrap: {
        width: "80px", height: "80px", borderRadius: "50%",
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
    },
    emptyTitle: { fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.3px" },
    emptyDesc: { fontSize: "15px", color: "#64748b", marginBottom: "28px" },
    emptyBtn: {
        padding: "14px 32px", border: "none", borderRadius: "14px",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 6px 16px -4px rgba(22,163,74,0.3)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    list: { display: "flex", flexDirection: "column", gap: "14px" },
    footer: { borderTop: "1px solid #e2e8f0", padding: "36px 24px", textAlign: "center" },
    footerText: { fontSize: "13px", color: "#94a3b8" },
};

export default RiwayatPage;
