import { useEffect, useRef, useState } from "react";

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

function TentangPage() {
    const [missionRef, missionVis] = useInView();
    const [techRef, techVis] = useInView();
    const [stepsRef, stepsVis] = useInView();
    const [teamRef, teamVis] = useInView();

    return (
        <div>
            {/* Header */}
            <section style={s.hero}>
                <div style={s.heroBlob1} />
                <div style={s.heroBlob2} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={s.label} className="animate-fade-in-up">TENTANG KAMI</span>
                    <h1 className="tentang-hero-title animate-fade-in-up delay-1" style={s.heroTitle}>
                        Teknologi AI untuk<br />Pertanian yang Lebih Baik
                    </h1>
                    <p style={s.heroDesc} className="animate-fade-in-up delay-2">
                        AgroScan membantu petani dan peneliti mengidentifikasi penyakit tanaman
                        secara cepat dan akurat menggunakan deep learning.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section style={s.section} ref={missionRef}>
                <div style={s.container}>
                    <div className="tentang-twocol" style={s.twoCol}>
                        <div className={missionVis ? "animate-slide-left" : ""} style={{ opacity: missionVis ? 1 : 0 }}>
                            <span style={s.labelSmall}>MISI KAMI</span>
                            <h2 style={s.heading}>Memberdayakan petani dengan teknologi</h2>
                            <p style={s.text}>
                                Kehilangan hasil panen akibat penyakit tanaman adalah masalah yang
                                dapat dicegah. Dengan AgroScan, petani memiliki akses ke diagnosis
                                cepat yang sebelumnya hanya tersedia melalui laboratorium.
                            </p>
                            <p style={s.text}>
                                Kami percaya teknologi harus dapat diakses oleh semua orang,
                                terutama mereka yang paling membutuhkannya.
                            </p>
                        </div>
                        <div style={s.statsGrid} className={missionVis ? "animate-slide-right" : ""} >
                            {[
                                { val: "1000+", label: "Data pelatihan", icon: "📊" },
                                { val: "CNN", label: "Deep learning", icon: "🧠" },
                                { val: "< 5 dtk", label: "Waktu diagnosis", icon: "⚡" },
                                { val: "Gratis", label: "Tanpa biaya", icon: "🎁" },
                            ].map((st) => (
                                <div key={st.label} style={s.statCard}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}>
                                    <span style={{ fontSize: "24px", marginBottom: "8px", display: "block" }}>{st.icon}</span>
                                    <p style={s.statVal}>{st.val}</p>
                                    <p style={s.statLabel}>{st.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech */}
            <section style={{ ...s.section, background: "#fafbfc" }} ref={techRef}>
                <div style={s.container}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <span style={s.labelSmall} className={techVis ? "animate-fade-in-up" : ""}>TEKNOLOGI</span>
                        <h2 style={s.heading} className={techVis ? "animate-fade-in-up delay-1" : ""}>Dibangun dengan stack modern</h2>
                    </div>
                    <div className="tentang-techgrid" style={s.techGrid}>
                        {[
                            { name: "React", desc: "Frontend", icon: "⚛️" },
                            { name: "Express.js", desc: "Backend API", icon: "🚀" },
                            { name: "FastAPI", desc: "AI server", icon: "🐍" },
                            { name: "TensorFlow", desc: "Model CNN", icon: "🤖" },
                        ].map((t, i) => (
                            <div key={t.name} style={s.techCard}
                                className={techVis ? `animate-fade-in-up delay-${i + 2}` : ""}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0,0,0,0.1)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(0,0,0,0.05)"; }}>
                                <span style={{ fontSize: "36px", marginBottom: "16px", display: "block" }}>{t.icon}</span>
                                <p style={s.techName}>{t.name}</p>
                                <p style={s.techDesc}>{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to use */}
            <section style={s.section} ref={stepsRef}>
                <div style={s.container}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <span style={s.labelSmall} className={stepsVis ? "animate-fade-in-up" : ""}>PANDUAN</span>
                        <h2 style={s.heading} className={stepsVis ? "animate-fade-in-up delay-1" : ""}>Cara menggunakan</h2>
                    </div>
                    <div className="tentang-stepsgrid" style={s.stepsGrid}>
                        {[
                            { num: "1", title: "Buka halaman Scan", desc: "Klik menu Scan di navigasi" },
                            { num: "2", title: "Upload atau foto daun", desc: "Pilih gambar dari galeri atau kamera" },
                            { num: "3", title: "Tunggu analisis AI", desc: "Proses hanya beberapa detik" },
                            { num: "4", title: "Lihat hasil dan saran", desc: "Dapatkan diagnosis dan langkah penanganan" },
                        ].map((step, i) => (
                            <div key={step.num} style={s.stepCard}
                                className={stepsVis ? `animate-fade-in-up delay-${i + 2}` : ""}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
                                <div style={s.stepNum}>{step.num}</div>
                                <p style={s.stepTitle}>{step.title}</p>
                                <p style={s.stepDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section style={{ ...s.section, background: "#fafbfc" }} ref={teamRef}>
                <div style={s.container}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <span style={s.labelSmall} className={teamVis ? "animate-fade-in-up" : ""}>TIM PENGEMBANG</span>
                        <h2 style={s.heading} className={teamVis ? "animate-fade-in-up delay-1" : ""}>Orang-orang di balik AgroScan</h2>
                    </div>
                    <div className="tentang-teamgrid" style={s.teamGrid}>
                        {[
                            { name: "Yogi", role: "Backend Developer & AI Engineer", desc: "Mengembangkan API backend dan melatih model CNN untuk deteksi penyakit tanaman.", photo: "/dev-yogi.jpg" },
                            { name: "Roy", role: "Frontend Developer", desc: "Merancang dan membangun antarmuka web yang responsif dan mudah digunakan.", photo: "/dev-roy.jpg" },
                            { name: "Farisky", role: "Mobile Developer", desc: "Mengembangkan aplikasi mobile agar AgroScan dapat diakses dari perangkat seluler.", photo: "/dev-farisky.jpg" },
                        ].map((dev, i) => (
                            <div key={dev.name} style={s.teamCard}
                                className={teamVis ? `animate-fade-in-up delay-${i + 2}` : ""}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 24px 48px -12px rgba(0,0,0,0.12)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(0,0,0,0.06)"; }}>
                                <div style={s.teamPhotoWrap}>
                                    <img src={dev.photo} alt={dev.name} style={s.teamPhoto} />
                                </div>
                                <h4 style={s.teamName}>{dev.name}</h4>
                                <p style={s.teamRole}>{dev.role}</p>
                                <p style={s.teamDesc}>{dev.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer style={s.footer}>
                <p style={s.footerText}>© 2026 AgroScan. Deteksi penyakit tanaman berbasis AI.</p>
            </footer>
        </div>
    );
}

const s = {
    hero: {
        textAlign: "center", padding: "120px 24px 80px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #faf5ff 50%, #ffffff 100%)",
        position: "relative", overflow: "hidden",
    },
    heroBlob1: {
        position: "absolute", width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
        top: "-50px", right: "10%", borderRadius: "50%",
        animation: "blob 8s ease-in-out infinite",
    },
    heroBlob2: {
        position: "absolute", width: "250px", height: "250px",
        background: "radial-gradient(circle, rgba(126,34,206,0.08) 0%, transparent 70%)",
        bottom: "0", left: "5%", borderRadius: "50%",
        animation: "blob 10s ease-in-out infinite reverse",
    },
    label: {
        display: "inline-block", padding: "7px 18px",
        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
        color: "#15803d", fontSize: "13px", fontWeight: "800",
        borderRadius: "20px", letterSpacing: "1.5px", marginBottom: "18px",
    },
    heroTitle: {
        fontSize: "46px", fontWeight: "800", color: "#0f172a",
        lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-1px",
    },
    heroDesc: {
        fontSize: "18px", color: "#475569", maxWidth: "600px",
        margin: "0 auto", lineHeight: 1.8,
    },
    section: { padding: "120px 24px" },
    container: { maxWidth: "1100px", margin: "0 auto" },
    labelSmall: {
        display: "inline-block", padding: "7px 18px",
        background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
        color: "#7e22ce", fontSize: "13px", fontWeight: "800",
        borderRadius: "20px", letterSpacing: "1.5px", marginBottom: "18px",
    },
    heading: {
        fontSize: "38px", fontWeight: "800", color: "#0f172a",
        margin: "0 0 24px", letterSpacing: "-0.8px",
    },
    text: { fontSize: "16px", color: "#64748b", lineHeight: 1.8, marginBottom: "16px" },
    twoCol: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "center" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
    statCard: {
        background: "linear-gradient(135deg, #16a34a 0%, #0f4c23 100%)",
        borderRadius: "24px", padding: "32px 24px", textAlign: "center",
        boxShadow: "0 12px 32px -8px rgba(22,163,74,0.35)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
        cursor: "default",
    },
    statVal: { fontSize: "32px", fontWeight: "800", color: "#ffffff", marginBottom: "8px" },
    statLabel: { fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.85)", margin: 0 },
    techGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" },
    techCard: {
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "24px", padding: "36px 28px", textAlign: "center",
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.05)",
        transition: "all 0.4s cubic-bezier(0.33,1,0.68,1)",
        cursor: "default",
    },
    techName: { fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.3px" },
    techDesc: { fontSize: "15px", color: "#64748b", margin: 0 },
    stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" },
    stepCard: {
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)", borderRadius: "24px",
        padding: "36px 28px", textAlign: "left", display: "flex", flexDirection: "column",
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
        cursor: "default",
    },
    stepNum: {
        width: "52px", height: "52px", borderRadius: "16px",
        background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)", color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px", fontWeight: "800", marginBottom: "24px",
        boxShadow: "0 8px 20px -6px rgba(22,163,74,0.4)",
    },
    stepTitle: { fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.3px" },
    stepDesc: { fontSize: "15px", color: "#64748b", lineHeight: 1.6, margin: 0 },
    teamGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" },
    teamCard: {
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "28px", padding: "44px 32px", textAlign: "center",
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.06)",
        transition: "all 0.4s cubic-bezier(0.33,1,0.68,1)",
        cursor: "default",
    },
    teamPhotoWrap: {
        width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto 24px",
        background: "linear-gradient(135deg, #22c55e, #7e22ce)",
        padding: "3px", boxShadow: "0 8px 24px -6px rgba(22,163,74,0.25)",
    },
    teamPhoto: {
        width: "100%", height: "100%", borderRadius: "50%",
        objectFit: "cover", border: "3px solid #fff",
        display: "block",
    },
    teamName: { fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.3px" },
    teamRole: {
        fontSize: "13px", fontWeight: "700", color: "#16a34a", marginBottom: "16px",
        textTransform: "uppercase", letterSpacing: "1.5px",
    },
    teamDesc: { fontSize: "15px", color: "#64748b", lineHeight: 1.6, margin: 0 },
    footer: {
        borderTop: "1px solid #e2e8f0", padding: "48px 24px", textAlign: "center",
        background: "#fafbfc",
    },
    footerText: { fontSize: "14px", color: "#94a3b8" },
};

export default TentangPage;
