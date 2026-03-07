function TentangPage() {
    return (
        <div>
            {/* Header */}
            <section style={s.hero}>
                <span style={s.label}>TENTANG KAMI</span>
                <h1 style={s.heroTitle}>
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
                    <div style={s.twoCol}>
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
                    <div style={s.techGrid}>
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
                    <div style={s.stepsGrid}>
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
                    <div style={s.teamGrid}>
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
        textAlign: "center", padding: "130px 24px 72px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #fff 100%)",
    },
    label: { color: "#16a34a", fontSize: "12px", fontWeight: "600", letterSpacing: "1.5px" },
    heroTitle: {
        fontSize: "36px", fontWeight: "700", color: "#111",
        lineHeight: 1.2, margin: "12px 0 14px",
    },
    heroDesc: {
        fontSize: "15px", color: "#777", maxWidth: "500px",
        margin: "0 auto", lineHeight: 1.7,
    },
    section: { padding: "72px 24px" },
    container: { maxWidth: "880px", margin: "0 auto" },
    labelSmall: { color: "#16a34a", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px" },
    heading: { fontSize: "24px", fontWeight: "700", color: "#111", margin: "6px 0 14px" },
    text: { fontSize: "14px", color: "#666", lineHeight: 1.7, marginBottom: "10px" },
    twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    statCard: {
        background: "#f0fdf4", border: "1px solid #dcfce7",
        borderRadius: "10px", padding: "20px 14px", textAlign: "center",
    },
    statVal: { fontSize: "20px", fontWeight: "700", color: "#166534", marginBottom: "2px" },
    statLabel: { fontSize: "12px", color: "#888", margin: 0 },
    techGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" },
    techCard: {
        background: "#fff", border: "1px solid #eee",
        borderRadius: "10px", padding: "24px 14px", textAlign: "center",
    },
    techName: { fontSize: "15px", fontWeight: "600", color: "#111", marginBottom: "4px" },
    techDesc: { fontSize: "12px", color: "#aaa", margin: 0 },
    stepsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" },
    stepCard: {
        border: "1px solid #f0f0f0", borderRadius: "10px",
        padding: "22px 14px", textAlign: "center",
    },
    stepNum: {
        width: "32px", height: "32px", borderRadius: "50%",
        background: "#f0fdf4", color: "#16a34a",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: "600", marginBottom: "12px",
    },
    stepTitle: { fontSize: "13px", fontWeight: "600", color: "#111", marginBottom: "4px" },
    stepDesc: { fontSize: "12px", color: "#888", lineHeight: 1.4, margin: 0 },
    teamGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
    teamCard: {
        background: "#fff", border: "1px solid #eee",
        borderRadius: "12px", padding: "28px 20px", textAlign: "center",
    },
    teamPhoto: {
        width: "100%", maxWidth: "180px", height: "auto", borderRadius: "8px",
        objectFit: "contain", marginBottom: "14px",
    },
    teamName: { fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "4px" },
    teamRole: { fontSize: "13px", fontWeight: "600", color: "#16a34a", marginBottom: "10px" },
    teamDesc: { fontSize: "13px", color: "#888", lineHeight: 1.5, margin: 0 },
    footer: { borderTop: "1px solid #f0f0f0", padding: "24px", textAlign: "center" },
    footerText: { fontSize: "13px", color: "#bbb" },
};

export default TentangPage;
