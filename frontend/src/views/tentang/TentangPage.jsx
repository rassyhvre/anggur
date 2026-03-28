function TentangPage() {
    return (
        <div>
            {/* Header */}
            <section style={s.hero}>
                <span style={s.label}>TENTANG KAMI</span>
                <h1 className="tentang-hero-title" style={s.heroTitle}>
                    Teknologi AI untuk<br />Pertanian yang Lebih Baik
                </h1>
                <p style={s.heroDesc}>
                    AgroScan membantu petani dan peneliti mengidentifikasi penyakit tanaman
                    secara cepat dan akurat menggunakan deep learning.
                </p>
            </section>

            {/* Mission */}
            <section style={s.section}>
                <div style={s.container}>
                    <div className="tentang-twocol" style={s.twoCol}>
                        <div>
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
                        <div style={s.statsGrid}>
                            {[
                                { val: "1000+", label: "Data pelatihan" },
                                { val: "CNN", label: "Deep learning" },
                                { val: "< 5 dtk", label: "Waktu diagnosis" },
                                { val: "Gratis", label: "Tanpa biaya" },
                            ].map((st) => (
                                <div key={st.label} style={s.statCard}>
                                    <p style={s.statVal}>{st.val}</p>
                                    <p style={s.statLabel}>{st.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech */}
            <section style={{ ...s.section, background: "#fafafa" }}>
                <div style={s.container}>
                    <div style={{ textAlign: "center", marginBottom: "40px" }}>
                        <span style={s.labelSmall}>TEKNOLOGI</span>
                        <h2 style={s.heading}>Dibangun dengan stack modern</h2>
                    </div>
                    <div className="tentang-techgrid" style={s.techGrid}>
                        {[
                            { name: "React", desc: "Frontend" },
                            { name: "Express.js", desc: "Backend API" },
                            { name: "FastAPI", desc: "AI server" },
                            { name: "TensorFlow", desc: "Model CNN" },
                        ].map((t) => (
                            <div key={t.name} style={s.techCard}>
                                <p style={s.techName}>{t.name}</p>
                                <p style={s.techDesc}>{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to use */}
            <section style={s.section}>
                <div style={s.container}>
                    <div style={{ textAlign: "center", marginBottom: "40px" }}>
                        <span style={s.labelSmall}>PANDUAN</span>
                        <h2 style={s.heading}>Cara menggunakan</h2>
                    </div>
                    <div className="tentang-stepsgrid" style={s.stepsGrid}>
                        {[
                            { num: "1", title: "Buka halaman Scan", desc: "Klik menu Scan di navigasi" },
                            { num: "2", title: "Upload atau foto daun", desc: "Pilih gambar dari galeri atau kamera" },
                            { num: "3", title: "Tunggu analisis AI", desc: "Proses hanya beberapa detik" },
                            { num: "4", title: "Lihat hasil dan saran", desc: "Dapatkan diagnosis dan langkah penanganan" },
                        ].map((step) => (
                            <div key={step.num} style={s.stepCard}>
                                <div style={s.stepNum}>{step.num}</div>
                                <p style={s.stepTitle}>{step.title}</p>
                                <p style={s.stepDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section style={{ ...s.section, background: "#fafafa" }}>
                <div style={s.container}>
                    <div style={{ textAlign: "center", marginBottom: "40px" }}>
                        <span style={s.labelSmall}>TIM PENGEMBANG</span>
                        <h2 style={s.heading}>Orang-orang di balik AgroScan</h2>
                    </div>
                    <div className="tentang-teamgrid" style={s.teamGrid}>
                        {[
                            { name: "Yogi", role: "Backend Developer & AI Engineer", desc: "Mengembangkan API backend dan melatih model CNN untuk deteksi penyakit tanaman.", photo: "/dev-yogi.jpg" },
                            { name: "Roy", role: "Frontend Developer", desc: "Merancang dan membangun antarmuka web yang responsif dan mudah digunakan.", photo: "/dev-roy.jpg" },
                            { name: "Farisky", role: "Mobile Developer", desc: "Mengembangkan aplikasi mobile agar AgroScan dapat diakses dari perangkat seluler.", photo: "/dev-farisky.jpg" },
                        ].map((dev) => (
                            <div key={dev.name} style={s.teamCard}>
                                <img src={dev.photo} alt={dev.name} style={s.teamPhoto} />
                                <h4 style={s.teamName}>{dev.name}</h4>
                                <p style={s.teamRole}>{dev.role}</p>
                                <p style={s.teamDesc}>{dev.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer style={s.footer}>
                <p style={s.footerText}>© 2026 AgroScan</p>
            </footer>
        </div>
    );
}

const s = {
    hero: {
        textAlign: "center", padding: "100px 24px 80px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
    },
    label: { 
        display: "inline-block", padding: "6px 16px", background: "#dcfce7", color: "#16a34a", 
        fontSize: "13px", fontWeight: "700", borderRadius: "20px", letterSpacing: "1px", marginBottom: "16px"
    },
    heroTitle: {
        fontSize: "42px", fontWeight: "800", color: "#0f172a",
        lineHeight: 1.2, margin: "0 0 20px", letterSpacing: "-0.5px"
    },
    heroDesc: {
        fontSize: "18px", color: "#64748b", maxWidth: "600px",
        margin: "0 auto", lineHeight: 1.8,
    },
    section: { padding: "100px 24px" },
    container: { maxWidth: "1100px", margin: "0 auto" },
    labelSmall: { 
        display: "inline-block", padding: "6px 16px", background: "#f3e8ff", color: "#7e22ce", 
        fontSize: "13px", fontWeight: "700", borderRadius: "20px", letterSpacing: "1px", marginBottom: "16px"
    },
    heading: { fontSize: "36px", fontWeight: "800", color: "#0f172a", margin: "0 0 20px", letterSpacing: "-0.5px" },
    text: { fontSize: "16px", color: "#64748b", lineHeight: 1.8, marginBottom: "16px" },
    twoCol: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "center" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
    statCard: {
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", 
        borderRadius: "20px", padding: "32px 24px", textAlign: "center",
        boxShadow: "0 20px 40px -15px rgba(22, 163, 74, 0.4)",
    },
    statVal: { fontSize: "32px", fontWeight: "800", color: "#ffffff", marginBottom: "8px" },
    statLabel: { fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.9)", margin: 0 },
    techGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" },
    techCard: {
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "20px", padding: "32px 24px", textAlign: "center",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)",
    },
    techName: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" },
    techDesc: { fontSize: "15px", color: "#64748b", margin: 0 },
    stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" },
    stepCard: {
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)", borderRadius: "20px",
        padding: "32px 24px", textAlign: "left", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)",
    },
    stepNum: {
        width: "48px", height: "48px", borderRadius: "14px",
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px", fontWeight: "800", marginBottom: "24px",
        boxShadow: "0 10px 20px -10px rgba(22, 163, 74, 0.5)"
    },
    stepTitle: { fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" },
    stepDesc: { fontSize: "15px", color: "#64748b", lineHeight: 1.6, margin: 0 },
    teamGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" },
    teamCard: {
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "24px", padding: "40px 32px", textAlign: "center",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)",
    },
    teamPhoto: {
        width: "120px", height: "120px", borderRadius: "50%",
        objectFit: "cover", marginBottom: "20px",
        border: "4px solid #f8fafc", boxShadow: "0 10px 20px -10px rgba(0,0,0,0.1)",
        display: "inline-block" // Ensure the image is centered
    },
    teamName: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" },
    teamRole: { fontSize: "14px", fontWeight: "700", color: "#16a34a", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" },
    teamDesc: { fontSize: "15px", color: "#64748b", lineHeight: 1.6, margin: 0 },
    footer: { borderTop: "1px solid #e2e8f0", padding: "40px 24px", textAlign: "center", background: "#ffffff" },
    footerText: { fontSize: "14px", color: "#94a3b8" },
};

export default TentangPage;
