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
                            { step: "2", title: "Analisis otomatis", desc: "Model deep learning kami menganalisis gambar dan mengidentifikasi jenis penyakit." },
                            { step: "3", title: "Dapatkan penanganan", desc: "Lihat hasil diagnosis beserta langkah penanganan yang bisa langsung diterapkan." },
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
                        <button onClick={() => navigate("/scan")} style={feat.btn}>
                            Coba Sekarang
                        </button>
                    </div>
                    <div style={feat.cards}>
                        {[
                            { title: "Hasil instan", desc: "Diagnosis dalam hitungan detik, bukan hari" },
                            { title: "Akurasi tinggi", desc: "Didukung model CNN yang terlatih dengan ribuan data" },
                            { title: "Tanpa keahlian khusus", desc: "Cukup foto atau upload, sangat mudah digunakan" },
                            { title: "Riwayat tersimpan", desc: "Semua hasil diagnosis tersimpan untuk referensi" },
                        ].map((f) => (
                            <div key={f.title} style={feat.card}>
                                <h4 style={feat.cardTitle}>{f.title}</h4>
                                <p style={feat.cardDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={cta.section}>
                <h2 style={cta.heading}>Siap melindungi tanaman Anda?</h2>
                <p style={cta.desc}>Mulai diagnosis pertama Anda — gratis dan tanpa perlu mendaftar.</p>
                <button onClick={() => navigate("/scan")} style={cta.btn}>
                    Mulai Scan Sekarang
                </button>
            </section>

            {/* Footer */}
            <footer style={ft.footer}>
                <div className="footer-inner" style={ft.inner}>
                    <p style={ft.copy}>© 2026 AgroScan</p>
                    <div style={ft.links}>
                        <span style={ft.link} onClick={() => navigate("/tentang")}>Tentang</span>
                        <span style={ft.link} onClick={() => navigate("/scan")}>Scan</span>
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
    section: { padding: "90px 24px", background: "#fff" },
    container: { maxWidth: "920px", margin: "0 auto", textAlign: "center" },
    label: { color: "#16a34a", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px" },
    heading: { fontSize: "30px", fontWeight: "700", color: "#111", margin: "8px 0 10px" },
    sub: { color: "#888", fontSize: "15px", marginBottom: "48px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
    card: {
        padding: "32px 20px", borderRadius: "12px",
        border: "1px solid #f0f0f0", textAlign: "center",
    },
    stepNum: {
        width: "36px", height: "36px", borderRadius: "50%",
        background: "#f0fdf4", color: "#16a34a",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", fontWeight: "700", marginBottom: "18px",
    },
    cardTitle: { fontSize: "16px", fontWeight: "600", color: "#111", marginBottom: "8px" },
    cardDesc: { fontSize: "14px", color: "#777", lineHeight: 1.6 },
};

const feat = {
    section: { padding: "90px 24px", background: "#fafafa" },
    container: {
        maxWidth: "920px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "start",
    },
    label: { color: "#16a34a", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px" },
    heading: { fontSize: "28px", fontWeight: "700", color: "#111", margin: "8px 0 14px", lineHeight: 1.25 },
    desc: { fontSize: "15px", color: "#666", lineHeight: 1.7, marginBottom: "24px" },
    btn: {
        padding: "11px 24px", border: "none", borderRadius: "8px",
        background: "#16a34a", color: "#fff", fontSize: "14px",
        fontWeight: "600", cursor: "pointer",
    },
    cards: { display: "flex", flexDirection: "column", gap: "12px" },
    card: {
        background: "#fff", border: "1px solid #eee",
        borderRadius: "10px", padding: "18px 20px",
    },
    cardTitle: { fontSize: "15px", fontWeight: "600", color: "#111", marginBottom: "4px" },
    cardDesc: { fontSize: "13px", color: "#888", lineHeight: 1.5, margin: 0 },
};

const cta = {
    section: {
        background: "#166534", padding: "72px 24px", textAlign: "center",
    },
    heading: { fontSize: "26px", fontWeight: "700", color: "#fff", marginBottom: "10px" },
    desc: { fontSize: "15px", color: "rgba(255,255,255,0.75)", marginBottom: "28px" },
    btn: {
        padding: "13px 32px", border: "1px solid rgba(255,255,255,0.4)",
        borderRadius: "8px", background: "transparent",
        color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer",
    },
};

const ft = {
    footer: { borderTop: "1px solid #f0f0f0", padding: "24px 24px", background: "#fff" },
    inner: {
        maxWidth: "920px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    copy: { fontSize: "13px", color: "#aaa" },
    links: { display: "flex", gap: "20px" },
    link: { fontSize: "13px", color: "#888", cursor: "pointer" },
};

export default HomePage;
