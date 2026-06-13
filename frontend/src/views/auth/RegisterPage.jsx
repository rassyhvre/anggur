import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/api";

function RegisterPage() {
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!nama || !email || !password) { setError("Semua field wajib diisi"); return; }
        if (password.length < 6) { setError("Password minimal 6 karakter"); return; }
        try {
            setLoading(true);
            const result = await registerUser(nama, email, password);
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify({
                id: result.data.id_pengguna, nama: result.data.nama,
                email: result.data.email, role: result.data.role || "user",
            }));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registrasi gagal");
        } finally { setLoading(false); }
    };

    const inputStyle = {
        padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
        background: "#fff", color: "#0f172a", fontSize: "15px",
        outline: "none", fontFamily: "inherit", transition: "all 0.2s ease",
    };

    const focusHandler = e => { e.target.style.borderColor = "#16a34a"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; };
    const blurHandler = e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; };

    return (
        <div style={s.page}>
            <div style={s.blob1} />
            <div style={s.blob2} />

            <div style={s.card} className="animate-scale-in">
                <div style={s.iconWrap}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                </div>
                <h1 style={s.title}>Buat Akun</h1>
                <p style={s.subtitle}>Daftar untuk mulai menggunakan AgroScan</p>

                <form onSubmit={handleSubmit} style={s.form}>
                    {error && <div style={s.error}>{error}</div>}
                    <div style={s.group}>
                        <label style={s.label}>Nama Lengkap</label>
                        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                            placeholder="Masukkan nama" style={inputStyle}
                            onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                    <div style={s.group}>
                        <label style={s.label}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com" style={inputStyle}
                            onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                    <div style={s.group}>
                        <label style={s.label}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 6 karakter" style={inputStyle}
                            onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                    <button type="submit" disabled={loading}
                        style={{ ...s.btn, ...(loading ? { opacity: 0.6 } : {}) }}
                        onMouseEnter={e => { if (!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 28px -6px rgba(126,34,206,0.4)"; }}}
                        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 16px -4px rgba(126,34,206,0.3)"; }}>
                        {loading ? "Memproses..." : "Daftar Sekarang"}
                    </button>
                </form>
                <p style={s.switchText}>
                    Sudah punya akun? <Link to="/login" style={s.switchLink}>Masuk</Link>
                </p>
            </div>
        </div>
    );
}

const s = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #faf5ff 0%, #f0fdf4 50%, #f8fafc 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 16px", position: "relative", overflow: "hidden",
    },
    blob1: {
        position: "absolute", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(126,34,206,0.08) 0%, transparent 70%)",
        top: "-100px", left: "-100px", borderRadius: "50%",
        animation: "blob 8s ease-in-out infinite",
    },
    blob2: {
        position: "absolute", width: "350px", height: "350px",
        background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
        bottom: "-80px", right: "-80px", borderRadius: "50%",
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
        background: "linear-gradient(135deg, #faf5ff, #f3e8ff)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
    },
    title: { fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "6px", letterSpacing: "-0.5px" },
    subtitle: { fontSize: "15px", color: "#64748b", marginBottom: "28px" },
    form: { display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" },
    group: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { color: "#475569", fontSize: "14px", fontWeight: "600" },
    btn: {
        padding: "14px", border: "none", borderRadius: "12px",
        background: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
        color: "#fff", fontSize: "15px", fontWeight: "700",
        cursor: "pointer", marginTop: "4px",
        boxShadow: "0 6px 16px -4px rgba(126,34,206,0.3)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    error: {
        color: "#b91c1c", fontSize: "14px", textAlign: "center",
        padding: "12px 16px", background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
        borderRadius: "12px", border: "1px solid #fecaca",
    },
    switchText: { color: "#64748b", fontSize: "14px", marginTop: "24px" },
    switchLink: { color: "#7e22ce", fontWeight: "700", textDecoration: "none" },
};

export default RegisterPage;
