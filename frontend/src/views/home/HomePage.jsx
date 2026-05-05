import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* Intersection Observer hook for scroll animations */
function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
}

function HomePage() {
    const navigate = useNavigate();
    const [howRef, howVisible] = useInView();
    const [featRef, featVisible] = useInView();
    const [ctaRef, ctaVisible] = useInView(0.3);

    return (
        <div>
            {/* ===== HERO ===== */}
            <section style={hero.section}>
                <div style={hero.overlay} />

                {/* Animated decorative blobs */}
                <div style={hero.blob1} />
                <div style={hero.blob2} />

                <div style={hero.content} className="animate-fade-in-up">
                    <div style={hero.logoRow}>
                        <img src="/logo.png" alt="AgroScan" style={{ height: "52px", width: "auto", objectFit: "contain" }}
                            onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; }} />
                        <svg width="52" height="52" viewBox="0 0 28 28" fill="none" style={{ display: "none" }}>
                            <rect width="28" height="28" rx="7" fill="#16a34a" />
                            <path d="M9 18c0-5 3-9 8-10-2 3-3 6-3 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span style={hero.brandText}>
                            <span style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Agro</span>
                            <span style={{ background: "linear-gradient(135deg,#c084fc,#7e22ce)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Scan</span>
                        </span>
                    </div>

                    <h1 className="hero-title" style={hero.title}>
                        Scan Daun Anggur<br />untuk Mendeteksi<br />Penyakit Tanaman
                    </h1>
                    <p className="hero-desc" style={hero.desc}>
                        Identifikasi penyakit tanaman anggur secara instan dari<br />foto daun menggunakan teknologi AI.
                    </p>

                    <div style={hero.actions} className="animate-fade-in-up delay-3">
                        <button onClick={() => navigate("/scan")} style={hero.primaryBtn}
                            onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 16px 40px -8px rgba(22,163,74,0.5)"; }}
                            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 24px -6px rgba(22,163,74,0.4)"; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
                                <path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" />
                                <path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                            </svg>
                            Scan Daun Sekarang
                        </button>
                        <button onClick={() => navigate("/tentang")} style={hero.ghostBtn}
                            onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.transform = "translateY(0)"; }}>
                            Pelajari Selengkapnya →
                        </button>
                    </div>

                    {/* Scroll indicator */}
                    <div style={hero.scrollIndicator} className="animate-fade-in delay-5">
                        <div style={hero.scrollDot} />
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section style={how.section} ref={howRef}>
                <div style={how.container}>
                    <span style={how.label} className={howVisible ? "animate-fade-in-up" : ""} style2={{opacity: howVisible ? 1 : 0}}>CARA KERJA</span>
                    <h2 style={how.heading} className={howVisible ? "animate-fade-in-up delay-1" : ""}>Tiga langkah sederhana</h2>
                    <p style={how.sub} className={howVisible ? "animate-fade-in-up delay-2" : ""}>Tidak perlu keahlian khusus. Siapapun bisa menggunakannya.</p>

                    <div className="how-grid" style={how.grid}>
                        {[
                            { step: "1", title: "Foto daun tanaman", desc: "Ambil foto daun yang tampak tidak sehat menggunakan kamera atau upload dari galeri.", icon: "📸" },
                            { step: "2", title: "Analisis otomatis", desc: "Model deep learning kami menganalisis gambar dan mengidentifikasi jenis penyakit secara akurat.", icon: "🧠" },
                            { step: "3", title: "Dapatkan penanganan", desc: "Lihat hasil diagnosis beserta langkah penanganan yang bisa langsung Anda terapkan.", icon: "💊" },
                        ].map((item, i) => (
                            <div key={item.step} style={how.card}
                                className={howVisible ? `animate-fade-in-up delay-${i + 3}` : ""}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 24px 48px -12px rgba(0,0,0,0.12)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(0,0,0,0.06)"; }}>
                                <div style={how.stepNum}>
                                    <span style={{ fontSize: "22px" }}>{item.icon}</span>
                                </div>
                                <h3 style={how.cardTitle}>{item.title}</h3>
                                <p style={how.cardDesc}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section style={feat.section} ref={featRef}>
                <div className="feat-container" style={feat.container}>
                    <div className={featVisible ? "animate-slide-left" : ""}>
                        <span style={feat.label}>KEUNGGULAN</span>
                        <h2 style={feat.heading}>Solusi cerdas untuk kesehatan tanaman</h2>
                        <p style={feat.desc}>
                            AgroScan menggabungkan deep learning dengan database penyakit tanaman
                            untuk diagnosis yang akurat dan rekomendasi penanganan yang tepat.
                        </p>
                        <button onClick={() => { window.scrollTo(0, 0); navigate("/scan"); }} style={feat.btn}
                            onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 16px 32px -8px rgba(15,23,42,0.4)"; }}
                            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 20px -8px rgba(15,23,42,0.3)"; }}>
                            Coba Sekarang →
                        </button>
                    </div>
                    <div style={feat.cards} className={featVisible ? "animate-slide-right" : ""}>
                        {[
                            { title: "Hasil instan", desc: "Diagnosis dalam hitungan detik, bukan hari", color: "#7e22ce", bg: "#faf5ff",
                              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                            { title: "Akurasi tinggi", desc: "Didukung model CNN yang terlatih", color: "#eab308", bg: "#fefce8",
                              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
                            { title: "Sangat mudah", desc: "Cukup foto, tanpa keahlian khusus", color: "#16a34a", bg: "#f0fdf4",
                              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
                            { title: "Riwayat aman", desc: "Semua hasil diagnosis tersimpan", color: "#3b82f6", bg: "#eff6ff",
                              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> },
                        ].map((f, i) => (
                            <div key={f.title} style={feat.card}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0,0,0,0.1)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px -4px rgba(0,0,0,0.04)"; }}>
                                <div style={{ ...feat.iconWrap, background: f.bg }}>{f.icon}</div>
                                <h4 style={feat.cardTitle}>{f.title}</h4>
                                <p style={feat.cardDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section style={cta.section} ref={ctaRef}>
                <div style={cta.box} className={ctaVisible ? "animate-scale-in" : ""}>
                    <div style={cta.glow} />
                    <h2 style={cta.heading}>Siap melindungi tanaman Anda?</h2>
                    <p style={cta.desc}>Mulai diagnosis pertama Anda sekarang — gratis dan tanpa perlu mendaftar.</p>
                    <button onClick={() => { window.scrollTo(0, 0); navigate("/scan"); }} style={cta.btn}
                        onMouseEnter={e => { e.target.style.transform = "translateY(-3px) scale(1.03)"; e.target.style.boxShadow = "0 16px 40px -8px rgba(0,0,0,0.15)"; }}
                        onMouseLeave={e => { e.target.style.transform = "translateY(0) scale(1)"; e.target.style.boxShadow = "0 8px 24px -6px rgba(0,0,0,0.1)"; }}>
                        🚀 Mulai Scan Sekarang
                    </button>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer style={ft.footer}>
                <div className="footer-inner" style={ft.inner}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "800" }}>
                            <span style={{ color: "#22c55e" }}>Agro</span><span style={{ color: "#7e22ce" }}>Scan</span>
                        </span>
                        <span style={ft.copy}>© 2026</span>
                    </div>
                    <div style={ft.links}>
                        <span style={ft.link} onClick={() => navigate("/tentang")}
                            onMouseEnter={e => e.target.style.color = "#16a34a"}
                            onMouseLeave={e => e.target.style.color = "#64748b"}>Tentang</span>
                        <span style={ft.link} onClick={() => navigate("/scan")}
                            onMouseEnter={e => e.target.style.color = "#16a34a"}
                            onMouseLeave={e => e.target.style.color = "#64748b"}>Scan Daun</span>
                        <span style={ft.link} onClick={() => navigate("/riwayat")}
                            onMouseEnter={e => e.target.style.color = "#16a34a"}
                            onMouseLeave={e => e.target.style.color = "#64748b"}>Riwayat</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ===== STYLES ===== */
const hero = {
    section: {
        position: "relative", minHeight: "100vh",
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
    },
    overlay: {
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(5,46,22,0.75) 100%)",
    },
    blob1: {
        position: "absolute", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
        top: "-100px", right: "-100px",
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        animation: "blob 8s ease-in-out infinite, float 6s ease-in-out infinite",
    },
    blob2: {
        position: "absolute", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(126,34,206,0.12) 0%, transparent 70%)",
        bottom: "-50px", left: "-80px",
        borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
        animation: "blob 10s ease-in-out infinite reverse, float 8s ease-in-out infinite 2s",
    },
    content: {
        position: "relative", zIndex: 5, textAlign: "center",
        padding: "0 24px", maxWidth: "700px",
    },
    logoRow: {
        marginBottom: "24px", display: "flex", alignItems: "center",
        justifyContent: "center", gap: "14px",
    },
    brandText: {
        fontSize: "40px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1",
    },
    title: {
        fontSize: "52px", fontWeight: "800", color: "#fff",
        lineHeight: 1.08, margin: "0 0 20px", letterSpacing: "-1px",
        textShadow: "0 2px 40px rgba(0,0,0,0.2)",
    },
    desc: {
        color: "rgba(255,255,255,0.85)", fontSize: "18px",
        lineHeight: 1.7, margin: "0 0 40px",
    },
    actions: {
        display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap",
    },
    primaryBtn: {
        padding: "15px 32px", border: "none", borderRadius: "14px",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer",
        display: "flex", alignItems: "center",
        boxShadow: "0 8px 24px -6px rgba(22,163,74,0.4)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    ghostBtn: {
        padding: "15px 32px", border: "1.5px solid rgba(255,255,255,0.3)",
        borderRadius: "14px", background: "transparent",
        color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    scrollIndicator: {
        marginTop: "60px", display: "flex", justifyContent: "center",
    },
    scrollDot: {
        width: "24px", height: "40px", borderRadius: "12px",
        border: "2px solid rgba(255,255,255,0.3)", position: "relative",
        overflow: "hidden",
        background: "transparent",
    },
};

const how = {
    section: { padding: "140px 24px", background: "#fafbfc" },
    container: { maxWidth: "1100px", margin: "0 auto", textAlign: "center" },
    label: {
        display: "inline-block", padding: "7px 18px",
        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        color: "#15803d", fontSize: "13px", fontWeight: "800",
        borderRadius: "20px", letterSpacing: "1.5px", marginBottom: "18px",
    },
    heading: {
        fontSize: "40px", fontWeight: "800", color: "#0f172a",
        marginBottom: "16px", letterSpacing: "-0.8px",
    },
    sub: {
        color: "#64748b", fontSize: "17px", marginBottom: "70px",
        maxWidth: "600px", margin: "0 auto 70px", lineHeight: 1.7,
    },
    grid: {
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px",
    },
    card: {
        padding: "44px 36px", borderRadius: "24px", background: "#ffffff",
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.04)",
        textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start",
        transition: "all 0.4s cubic-bezier(0.33,1,0.68,1)",
        cursor: "default",
    },
    stepNum: {
        width: "56px", height: "56px", borderRadius: "16px",
        background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "28px",
        boxShadow: "0 8px 20px -6px rgba(22,163,74,0.4)",
    },
    cardTitle: { fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "14px", letterSpacing: "-0.3px" },
    cardDesc: { fontSize: "15px", color: "#64748b", lineHeight: 1.7 },
};

const feat = {
    section: { padding: "140px 24px", background: "#ffffff" },
    container: {
        maxWidth: "1100px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "center",
    },
    label: {
        display: "inline-block", padding: "7px 18px",
        background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
        color: "#7e22ce", fontSize: "13px", fontWeight: "800",
        borderRadius: "20px", letterSpacing: "1.5px", marginBottom: "18px",
    },
    heading: {
        fontSize: "40px", fontWeight: "800", color: "#0f172a",
        marginBottom: "24px", lineHeight: 1.15, letterSpacing: "-0.8px",
    },
    desc: { fontSize: "17px", color: "#64748b", lineHeight: 1.8, marginBottom: "36px" },
    btn: {
        padding: "16px 36px", border: "none", borderRadius: "14px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 8px 20px -8px rgba(15,23,42,0.3)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
    },
    cards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
    card: {
        background: "#fafbfc", border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "20px", padding: "32px 24px",
        boxShadow: "0 4px 12px -4px rgba(0,0,0,0.04)",
        transition: "all 0.4s cubic-bezier(0.33,1,0.68,1)",
        cursor: "default",
    },
    iconWrap: {
        width: "52px", height: "52px", borderRadius: "14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
    },
    cardTitle: { fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.3px" },
    cardDesc: { fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 },
};

const cta = {
    section: { padding: "60px 24px 140px", background: "#ffffff" },
    box: {
        maxWidth: "1000px", margin: "0 auto", position: "relative",
        background: "linear-gradient(135deg, #16a34a 0%, #0f4c23 100%)",
        borderRadius: "32px", padding: "80px 40px", textAlign: "center",
        boxShadow: "0 32px 64px -16px rgba(22,163,74,0.3)",
        overflow: "hidden",
    },
    glow: {
        position: "absolute", top: "-50%", right: "-20%",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
    },
    heading: {
        fontSize: "40px", fontWeight: "800", color: "#ffffff",
        marginBottom: "18px", letterSpacing: "-0.8px", position: "relative",
    },
    desc: {
        fontSize: "18px", color: "rgba(255,255,255,0.9)",
        marginBottom: "40px", maxWidth: "560px", margin: "0 auto 40px",
        lineHeight: 1.7, position: "relative",
    },
    btn: {
        padding: "18px 44px", border: "none", borderRadius: "16px",
        background: "#ffffff", color: "#16a34a",
        fontSize: "17px", fontWeight: "800", cursor: "pointer",
        boxShadow: "0 8px 24px -6px rgba(0,0,0,0.1)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
        position: "relative",
    },
};

const ft = {
    footer: {
        borderTop: "1px solid #e2e8f0", padding: "48px 24px",
        background: "#fafbfc",
    },
    inner: {
        maxWidth: "1100px", margin: "0 auto", display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px",
    },
    copy: { fontSize: "14px", color: "#94a3b8", marginLeft: "8px" },
    links: { display: "flex", gap: "32px" },
    link: {
        fontSize: "15px", fontWeight: "600", color: "#64748b",
        cursor: "pointer", transition: "color 0.2s ease",
    },
};

export default HomePage;
