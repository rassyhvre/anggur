import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRiwayat } from "../../services/api";

function ProfilePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [stats, setStats] = useState({ total: 0, healthy: 0, infected: 0, lastScan: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate("/login"); return; }
        const fetchStats = async () => {
            try {
                const data = await getRiwayat();
                const healthy = data.filter(d => d.nama_penyakit === "Healthy").length;
                setStats({
                    total: data.length,
                    healthy,
                    infected: data.length - healthy,
                    lastScan: data.length > 0 ? data[0].tanggal_deteksi : null,
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (!user) return null;

    const initial = user.nama?.charAt(0).toUpperCase() || "?";

    return (
        <div style={s.page}>
            <section style={s.header}>
                <div style={s.blob1} />
                <div style={s.blob2} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={s.eyebrow} className="animate-fade-in-up">PROFIL</span>
                    <h1 style={s.title} className="animate-fade-in-up delay-1">Profil Saya</h1>
                </div>
            </section>

            <div style={s.container}>
                {/* Profile Card */}
                <div style={s.profileCard} className="animate-scale-in">
                    <div style={s.avatarWrap}>
                        <div style={s.avatar}>{initial}</div>
                    </div>
                    <h2 style={s.userName}>{user.nama}</h2>
                    <p style={s.userEmail}>{user.email}</p>
                    <span style={s.roleBadge}>
                        {user.role === "admin" ? "👑 Administrator" : "🌱 Pengguna"}
                    </span>
                </div>

                {/* Info Cards */}
                <div style={s.infoGrid}>
                    <div style={s.infoCard}>
                        <div style={s.infoIcon}>👤</div>
                        <div>
                            <p style={s.infoLabel}>Nama Lengkap</p>
                            <p style={s.infoValue}>{user.nama}</p>
                        </div>
                    </div>
                    <div style={s.infoCard}>
                        <div style={s.infoIcon}>📧</div>
                        <div>
                            <p style={s.infoLabel}>Email</p>
                            <p style={s.infoValue}>{user.email}</p>
                        </div>
                    </div>
                    <div style={s.infoCard}>
                        <div style={s.infoIcon}>🔑</div>
                        <div>
                            <p style={s.infoLabel}>Role</p>
                            <p style={s.infoValue}>{user.role === "admin" ? "Administrator" : "User"}</p>
                        </div>
                    </div>
                    <div style={s.infoCard}>
                        <div style={s.infoIcon}>🆔</div>
                        <div>
                            <p style={s.infoLabel}>ID Pengguna</p>
                            <p style={s.infoValue}>{user.id}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <h3 style={s.sectionTitle}>📊 Statistik Diagnosis</h3>
                <div style={s.statsGrid}>
                    {[
                        { val: loading ? "..." : stats.total, label: "Total Scan", icon: "🔬", bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
                        { val: loading ? "..." : stats.healthy, label: "Sehat", icon: "✅", bg: "linear-gradient(135deg, #22c55e, #16a34a)" },
                        { val: loading ? "..." : stats.infected, label: "Terinfeksi", icon: "⚠️", bg: "linear-gradient(135deg, #f59e0b, #d97706)" },
                    ].map(st => (
                        <div key={st.label} style={{ ...s.statCard, background: st.bg }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}>
                            <span style={{ fontSize: "28px" }}>{st.icon}</span>
                            <p style={s.statVal}>{st.val}</p>
                            <p style={s.statLabel}>{st.label}</p>
                        </div>
                    ))}
                </div>

                {stats.lastScan && (
                    <p style={s.lastScan}>
                        Scan terakhir: {new Date(stats.lastScan).toLocaleDateString("id-ID", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                    </p>
                )}

                {/* Actions */}
                <div style={s.actions}>
                    <button onClick={() => navigate("/scan")} style={s.scanBtn}
                        onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 28px -6px rgba(22,163,74,0.4)"; }}
                        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 16px -4px rgba(22,163,74,0.3)"; }}>
                        🔬 Mulai Scan Baru
                    </button>
                    <button onClick={() => navigate("/riwayat")} style={s.riwayatBtn}
                        onMouseEnter={e => { e.target.style.background = "#f8fafc"; e.target.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.target.style.background = "#fff"; e.target.style.transform = "translateY(0)"; }}>
                        📋 Lihat Riwayat
                    </button>
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
    header: {
        textAlign: "center", padding: "120px 24px 56px",
        background: "linear-gradient(180deg, #faf5ff 0%, #fafbfc 100%)",
        position: "relative", overflow: "hidden",
    },
    blob1: {
        position: "absolute", width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(126,34,206,0.08) 0%, transparent 70%)",
        top: "-80px", right: "10%", borderRadius: "50%",
        animation: "blob 8s ease-in-out infinite",
    },
    blob2: {
        position: "absolute", width: "200px", height: "200px",
        background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        bottom: "-30px", left: "5%", borderRadius: "50%",
        animation: "blob 10s ease-in-out infinite reverse",
    },
    eyebrow: {
        display: "inline-block", padding: "7px 18px",
        background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
        color: "#7e22ce", fontSize: "13px", fontWeight: "800",
        borderRadius: "20px", letterSpacing: "1.5px", marginBottom: "16px",
    },
    title: {
        fontSize: "38px", fontWeight: "800", color: "#0f172a",
        marginBottom: "12px", letterSpacing: "-0.8px",
    },
    container: { maxWidth: "640px", margin: "0 auto", padding: "0 24px 80px" },
    profileCard: {
        background: "#fff", borderRadius: "24px", padding: "40px 32px",
        textAlign: "center", border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 12px 32px -8px rgba(0,0,0,0.06)",
        marginBottom: "28px",
    },
    avatarWrap: {
        width: "96px", height: "96px", borderRadius: "50%",
        background: "linear-gradient(135deg, #7e22ce, #22c55e)",
        padding: "3px", margin: "0 auto 20px",
        boxShadow: "0 8px 24px -6px rgba(126,34,206,0.3)",
    },
    avatar: {
        width: "100%", height: "100%", borderRadius: "50%",
        background: "#fff", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "36px", fontWeight: "800",
        color: "#7e22ce",
    },
    userName: { fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.5px" },
    userEmail: { fontSize: "15px", color: "#64748b", marginBottom: "16px" },
    roleBadge: {
        display: "inline-block", padding: "6px 16px",
        background: "linear-gradient(135deg, #f3e8ff, #faf5ff)",
        color: "#7e22ce", fontSize: "13px", fontWeight: "700",
        borderRadius: "20px", border: "1px solid #e9d5ff",
    },
    infoGrid: {
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
        marginBottom: "32px",
    },
    infoCard: {
        display: "flex", gap: "12px", alignItems: "center",
        background: "#fff", borderRadius: "16px", padding: "16px",
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 2px 8px -2px rgba(0,0,0,0.03)",
    },
    infoIcon: { fontSize: "24px", flexShrink: 0 },
    infoLabel: { fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 },
    infoValue: { fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 },
    sectionTitle: { fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", letterSpacing: "-0.3px" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" },
    statCard: {
        borderRadius: "20px", padding: "24px 16px", textAlign: "center",
        boxShadow: "0 8px 24px -6px rgba(0,0,0,0.15)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)", cursor: "default",
    },
    statVal: { fontSize: "28px", fontWeight: "800", color: "#fff", margin: "8px 0 4px" },
    statLabel: { fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.85)", margin: 0 },
    lastScan: {
        textAlign: "center", fontSize: "13px", color: "#64748b", marginBottom: "32px",
    },
    actions: {
        display: "flex", flexDirection: "column", gap: "12px",
    },
    scanBtn: {
        padding: "16px", border: "none", borderRadius: "14px",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 6px 16px -4px rgba(22,163,74,0.3)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    riwayatBtn: {
        padding: "16px", border: "1.5px solid #e2e8f0", borderRadius: "14px",
        background: "#fff", color: "#475569", fontSize: "16px",
        fontWeight: "700", cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    footer: { borderTop: "1px solid #e2e8f0", padding: "36px 24px", textAlign: "center" },
    footerText: { fontSize: "13px", color: "#94a3b8" },
};

export default ProfilePage;
