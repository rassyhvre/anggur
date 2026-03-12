import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Hero */}
            <section style={hero.section}>
                <div style={hero.overlay} />
                <div style={hero.content}>
                    <div style={{ marginBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                        <img
                            src="/logo.png"
                            alt="AgroScan Logo"
                            style={{ height: "48px", width: "auto", objectFit: "contain" }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <svg width="48" height="48" viewBox="0 0 28 28" fill="none" style={{ display: "none" }}>
                                <rect width="28" height="28" rx="7" fill="#16a34a" />
                                <path d="M9 18c0-5 3-9 8-10-2 3-3 6-3 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                <path d="M13 18c0-3 2-6 5-7" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-0.5px", lineHeight: "1" }}>
                                <span style={{ color: "#2ea043" }}>Agro</span><span style={{ color: "#7e22ce" }}>Scan</span>
                            </span>
                        </div>
                    </div>
                    <h1 className="hero-title" style={hero.title}>
                        Scan Daun Anggur<br />untuk Mendeteksi<br />Penyakit Tanaman
                    </h1>
                    <p className="hero-desc" style={hero.desc}>
                        Identifikasi penyakit tanaman anggur secara instan dari<br />foto daun.
                    </p>
                    <div style={hero.actions}>
                        <button onClick={() => navigate("/scan")} style={{ ...hero.primaryBtn, display: "flex", alignItems: "center" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
                                <path d="M4 8V6a2 2 0 0 1 2-2h2"></path>
                                <path d="M4 16v2a2 2 0 0 0 2 2h2"></path>
                                <path d="M16 4h2a2 2 0 0 1 2 2v2"></path>
                                <path d="M16 20h2a2 2 0 0 0 2-2v-2"></path>
                            </svg>
                            Scan Daun
                        </button>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={how.section}>
                <div style={how.container}>
                    <span style={how.label}>CARA KERJA</span>
                    <h2 style={how.heading}>Tiga langkah sederhana</h2>
                    <p style={how.sub}>Tidak perlu keahlian khusus. Siapapun bisa menggunakannya.</p>

                    <div className="how-grid" style={how.grid}>
                        {[
                            { step: "1", title: "Foto daun tanaman", desc: "Ambil foto daun yang tampak tidak sehat menggunakan kamera atau upload dari galeri." },
                            { step: "2", title: "Analisis otomatis", desc: "Model deep learning kami menganalisis gambar dan mengidentifikasi jenis penyakit secara akurat." },
                            { step: "3", title: "Dapatkan penanganan", desc: "Lihat hasil diagnosis beserta langkah penanganan yang bisa langsung Anda terapkan." },
                        ].map((item) => (
                            <div key={item.step} style={how.card}>
                                <div style={how.stepNum}>{item.step}</div>
                                <h3 style={how.cardTitle}>{item.title}</h3>
                                <p style={how.cardDesc}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={feat.section}>
                <div className="feat-container" style={feat.container}>
                    <div>
                        <span style={feat.label}>KEUNGGULAN</span>
                        <h2 style={feat.heading}>Solusi cerdas untuk kesehatan tanaman</h2>
                        <p style={feat.desc}>
                            AgroScan menggabungkan deep learning dengan database penyakit tanaman
                            untuk diagnosis yang akurat dan rekomendasi penanganan yang tepat.
                        </p>
                        <button onClick={() => { window.scrollTo(0, 0); navigate("/scan"); }} style={feat.btn}>
                            Coba Sekarang
                        </button>
                    </div>
                    <div style={feat.cards}>
                        {[
                            {
                                title: "Hasil instan",
                                desc: "Diagnosis dalam hitungan detik, bukan hari",
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            },
                            {
                                title: "Akurasi tinggi",
                                desc: "Didukung model CNN yang terlatih",
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            },
                            {
                                title: "Sangat mudah",
                                desc: "Cukup foto, tanpa keahlian khusus",
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            },
                            {
                                title: "Riwayat aman",
                                desc: "Semua hasil diagnosis tersimpan",
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            },
                        ].map((f) => (
                            <div key={f.title} style={feat.card}>
                                <div style={feat.iconWrap}>{f.icon}</div>
                                <h4 style={feat.cardTitle}>{f.title}</h4>
                                <p style={feat.cardDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={cta.section}>
                <div style={cta.box}>
                    <h2 style={cta.heading}>Siap melindungi tanaman Anda?</h2>
                    <p style={cta.desc}>Mulai diagnosis pertama Anda sekarang — gratis dan tanpa perlu mendaftar.</p>
                    <button onClick={() => { window.scrollTo(0, 0); navigate("/scan"); }} style={cta.btn}>
                        Mulai Scan Sekarang
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={ft.footer}>
                <div style={ft.inner}>
                    <p style={ft.copy}>© 2026 AgroScan</p>
                    <div style={ft.links}>
                        <span style={ft.link} onClick={() => navigate("/tentang")}>Tentang</span>
                        <span style={ft.link} onClick={() => navigate("/scan")}>Scan Daun</span>
                        <span style={ft.link} onClick={() => navigate("/riwayat")}>Riwayat</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const hero = {
    section: {
        position: "relative", minHeight: "100vh",
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    overlay: {
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(5,46,22,0.7) 100%)",
    },
    content: {
        position: "relative", zIndex: 1, textAlign: "center",
        padding: "0 24px", maxWidth: "640px",
    },
    label: {
        display: "inline-block",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "rgba(255,255,255,0.9)",
        fontSize: "12px", fontWeight: "600",
        padding: "5px 14px", borderRadius: "20px",
        marginBottom: "20px", letterSpacing: "0.5px",
    },
    title: {
        fontSize: "46px", fontWeight: "700", color: "#fff",
        lineHeight: 1.1, margin: "0 0 18px", letterSpacing: "-0.5px",
    },
    desc: {
        color: "rgba(255,255,255,0.8)", fontSize: "16px",
        lineHeight: 1.7, margin: "0 0 32px",
    },
    actions: { display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" },
    primaryBtn: {
        padding: "13px 28px", border: "none", borderRadius: "8px",
        background: "#16a34a", color: "#fff", fontSize: "15px",
        fontWeight: "600", cursor: "pointer",
    },
    ghostBtn: {
        padding: "13px 28px", border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "8px", background: "transparent",
        color: "#fff", fontSize: "15px", fontWeight: "500", cursor: "pointer",
    },
};

const how = {
    section: { padding: "120px 24px", background: "#f8fafc" },
    container: { maxWidth: "1100px", margin: "0 auto", textAlign: "center" },
    label: {
        display: "inline-block", padding: "6px 16px", background: "#dcfce7", color: "#16a34a",
        fontSize: "13px", fontWeight: "700", borderRadius: "20px", letterSpacing: "1px", marginBottom: "16px"
    },
    heading: { fontSize: "36px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", letterSpacing: "-0.5px" },
    sub: { color: "#64748b", fontSize: "16px", marginBottom: "60px", maxWidth: "600px", margin: "0 auto 60px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" },
    card: {
        padding: "40px 32px", borderRadius: "24px", background: "#ffffff",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.04)",
        textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start",
    },
    stepNum: {
        width: "48px", height: "48px", borderRadius: "14px",
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px", fontWeight: "800", marginBottom: "24px",
        boxShadow: "0 10px 20px -10px rgba(22, 163, 74, 0.5)"
    },
    cardTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" },
    cardDesc: { fontSize: "15px", color: "#64748b", lineHeight: 1.6 },
};

const feat = {
    section: { padding: "120px 24px", background: "#ffffff" },
    container: {
        maxWidth: "1100px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "center",
    },
    label: {
        display: "inline-block", padding: "6px 16px", background: "#f3e8ff", color: "#7e22ce",
        fontSize: "13px", fontWeight: "700", borderRadius: "20px", letterSpacing: "1px", marginBottom: "16px"
    },
    heading: { fontSize: "36px", fontWeight: "800", color: "#0f172a", marginBottom: "20px", lineHeight: 1.2, letterSpacing: "-0.5px" },
    desc: { fontSize: "16px", color: "#64748b", lineHeight: 1.8, marginBottom: "32px" },
    btn: {
        padding: "16px 32px", border: "none", borderRadius: "12px", background: "#0f172a",
        color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer",
        boxShadow: "0 10px 20px -10px rgba(15, 23, 42, 0.5)",
    },
    cards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
    card: {
        background: "#f8fafc", border: "1px solid rgba(0,0,0,0.03)",
        borderRadius: "20px", padding: "32px 24px",
    },
    iconWrap: {
        width: "48px", height: "48px", borderRadius: "12px", background: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
    },
    cardTitle: { fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" },
    cardDesc: { fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 },
};

const cta = {
    section: { padding: "80px 24px 120px", background: "#ffffff" },
    box: {
        maxWidth: "1000px", margin: "0 auto",
        background: "linear-gradient(135deg, #16a34a 0%, #14532d 100%)",
        borderRadius: "32px", padding: "72px 32px", textAlign: "center",
        boxShadow: "0 25px 50px -12px rgba(22, 163, 74, 0.25)",
    },
    heading: { fontSize: "36px", fontWeight: "800", color: "#ffffff", marginBottom: "20px", letterSpacing: "-0.5px" },
    desc: { fontSize: "18px", color: "rgba(255,255,255,0.9)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto" },
    btn: {
        padding: "18px 40px", border: "none", borderRadius: "14px", background: "#ffffff",
        color: "#16a34a", fontSize: "16px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
    },
};

const ft = {
    footer: { borderTop: "1px solid #e2e8f0", padding: "40px 24px", background: "#ffffff" },
    inner: {
        maxWidth: "1100px", margin: "0 auto", display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px"
    },
    logo: { display: "flex", alignItems: "center", gap: "12px" },
    copy: { fontSize: "14px", color: "#94a3b8", marginTop: "4px", margin: 0 },
    links: { display: "flex", gap: "32px" },
    link: { fontSize: "15px", fontWeight: "600", color: "#475569", cursor: "pointer" },
};

export default HomePage;
