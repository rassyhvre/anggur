import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) { setError("Email dan password wajib diisi"); return; }
        try {
            setLoading(true);
            const result = await loginUser(email, password);
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify({
                id: result.data.id_pengguna, nama: result.data.nama,
                email: result.data.email, role: result.data.role,
            }));
            navigate(result.data.role === "admin" ? "/admin" : "/");
        } catch (err) {
            setError(err.response?.data?.message || "Login gagal");
        } finally { setLoading(false); }
    };

    return (
        <div style={s.page}>
            {/* Decorative blobs */}
            <div style={s.blob1} />
            <div style={s.blob2} />

            <div style={s.card} className="animate-scale-in">
                <div style={s.iconWrap}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                </div>
                <h1 style={s.title}>Selamat Datang</h1>
                <p style={s.subtitle}>Masuk ke akun AgroScan Anda</p>

                <form onSubmit={handleSubmit} style={s.form}>
                    {error && <div style={s.error}>{error}</div>}
                    <div style={s.group}>
                        <label style={s.label}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com" style={s.input}
                            onFocus={e => { e.target.style.borderColor = "#16a34a"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
                            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
                    </div>
                    <div style={s.group}>
                        <label style={s.label}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password" style={s.input}
                            onFocus={e => { e.target.style.borderColor = "#16a34a"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
                            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
                    </div>
                    <button type="submit" disabled={loading}
                        style={{ ...s.btn, ...(loading ? { opacity: 0.6 } : {}) }}
                        onMouseEnter={e => { if (!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 28px -6px rgba(22,163,74,0.4)"; }}}
                        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 16px -4px rgba(22,163,74,0.3)"; }}>
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>
                <p style={s.switchText}>
                    Belum punya akun? <Link to="/register" style={s.switchLink}>Daftar</Link>
                </p>
            </div>
        </div>
    );
}

const s = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #faf5ff 50%, #f8fafc 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 16px", position: "relative", overflow: "hidden",
    },
    blob1: {
        position: "absolute", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
        top: "-100px", right: "-100px", borderRadius: "50%",
        animation: "blob 8s ease-in-out infinite",
    },
    blob2: {
        position: "absolute", width: "350px", height: "350px",
        background: "radial-gradient(circle, rgba(126,34,206,0.08) 0%, transparent 70%)",
        bottom: "-80px", left: "-80px", borderRadius: "50%",
        animation: "blob 10s ease-in-out infinite reverse",
    },
    card: {
        maxWidth: "420px", width: "100%", background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px", border: "1px solid rgba(0,0,0,0.06)",
        padding: "44px 36px", textAlign: "center",
        boxShadow: "0 20px 48px -12px rgba(0,0,0,0.08)",
        position: "relative", zIndex: 1,
    },
    iconWrap: {
        width: "56px", height: "56px", borderRadius: "16px",
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
    },
    title: { fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "6px", letterSpacing: "-0.5px" },
    subtitle: { fontSize: "15px", color: "#64748b", marginBottom: "28px" },
    form: { display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" },
    group: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { color: "#475569", fontSize: "14px", fontWeight: "600" },
    input: {
        padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
        background: "#fff", color: "#0f172a", fontSize: "15px",
        outline: "none", fontFamily: "inherit",
        transition: "all 0.2s ease",
    },
    btn: {
        padding: "14px", border: "none", borderRadius: "12px",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "#fff", fontSize: "15px", fontWeight: "700",
        cursor: "pointer", marginTop: "4px",
        boxShadow: "0 6px 16px -4px rgba(22,163,74,0.3)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    error: {
        color: "#b91c1c", fontSize: "14px", textAlign: "center",
        padding: "12px 16px", background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
        borderRadius: "12px", border: "1px solid #fecaca",
        animation: "fadeInUp 0.3s ease",
    },
    switchText: { color: "#64748b", fontSize: "14px", marginTop: "24px" },
    switchLink: { color: "#16a34a", fontWeight: "700", textDecoration: "none" },
};

export default LoginPage;
