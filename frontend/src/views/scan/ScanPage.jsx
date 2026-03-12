import { useState } from "react";
import { detectDisease } from "../../services/api";
import styles from "../../styles/appStyles";
import ModeTabs from "../home/components/ModeTabs";
import UploadArea from "../home/components/UploadArea";
import CameraCapture from "../home/components/CameraCapture";
import ImagePreview from "../home/components/ImagePreview";
import DetectionResult from "../home/components/DetectionResult";

function ScanPage() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("upload");
    const [showCamera, setShowCamera] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setResult(null);
        setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    };

    const handleCapture = (capturedFile, previewUrl) => {
        setFile(capturedFile);
        setPreview(previewUrl);
        setResult(null);
        setShowCamera(false);
    };

    const handleSubmit = async () => {
        if (!file) return alert("Pilih atau foto gambar terlebih dahulu");
        const token = localStorage.getItem("token");
        if (!token) return alert("Silakan login terlebih dahulu untuk melakukan deteksi");
        try {
            setLoading(true);
            const data = await detectDisease(file);
            setResult(data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) alert("Sesi berakhir. Silakan login kembali.");
            else alert("Gagal melakukan deteksi. Pastikan server berjalan.");
        } finally { setLoading(false); }
    };

    const resetAll = () => {
        setFile(null); setPreview(null); setResult(null);
        setShowCamera(false); setMode("upload");
    };

    const switchMode = (m) => {
        setMode(m); setFile(null); setPreview(null);
        setResult(null); setShowCamera(m === "camera");
    };

    return (
        <div style={p.wrapper}>
            {/* Page Header */}
            <section style={p.header}>
                <span style={p.label}>DIAGNOSIS AI</span>
                <h1 style={p.title}>Scan Penyakit Tanaman Anggur</h1>
                <p style={p.subtitle}>
                    Unggah atau ambil foto daun anggur Anda, dan dapatkan diagnosis beserta
                    rekomendasi penanganan secara instan.
                </p>
            </section>

            {/* Main Content */}
            <div className="scan-grid" style={p.mainGrid}>
                {/* Left: Scan Area */}
                <div style={p.scanCol}>
                    <div style={p.scanCard}>
                        <ModeTabs mode={mode} onSwitchMode={switchMode} />
                        {mode === "upload" && <UploadArea onFileChange={handleFileChange} />}
                        {mode === "camera" && showCamera && <CameraCapture onCapture={handleCapture} />}
                        <ImagePreview preview={preview} />
                        {file && !result && (
                            <div style={styles.actions}>
                                <button onClick={handleSubmit} disabled={loading}
                                    style={{ ...styles.detectBtn, ...(loading ? styles.detectBtnDisabled : {}) }}>
                                    {loading ? "Menganalisis..." : "Mulai Diagnosis"}
                                </button>
                            </div>
                        )}
                        <DetectionResult result={result} onReset={resetAll} />
                    </div>
                </div>

                {/* Right: Side Info */}
                <div style={p.infoCol}>
                    {/* Tips */}
                    <div style={p.infoCard}>
                        <h3 style={p.infoTitle}>Tips Foto yang Baik</h3>
                        <ul style={p.tipList}>
                            <li style={p.tipItem}>Pastikan daun terlihat jelas dan fokus</li>
                            <li style={p.tipItem}>Foto di tempat dengan cahaya yang cukup</li>
                            <li style={p.tipItem}>Tampilkan bagian daun yang terkena penyakit</li>
                            <li style={p.tipItem}>Hindari bayangan yang menutupi daun</li>
                            <li style={p.tipItem}>Gunakan latar belakang yang kontras</li>
                        </ul>
                    </div>

                    {/* Supported diseases */}
                    <div style={p.infoCard}>
                        <h3 style={p.infoTitle}>Penyakit yang Dideteksi</h3>
                        <div style={p.diseaseList}>
                            {[
                                { name: "Black Rot", color: "#7c3aed" },
                                { name: "Esca (Black Measles)", color: "#dc2626" },
                                { name: "Leaf Blight", color: "#ea580c" },
                                { name: "Healthy", color: "#16a34a" },
                            ].map((d) => (
                                <div key={d.name} style={p.diseaseTag}>
                                    <div style={{ ...p.dot, background: d.color }} />
                                    <span style={p.diseaseName}>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={p.infoCard}>
                        <h3 style={p.infoTitle}>Tentang Model AI</h3>
                        <div style={p.statsGrid}>
                            <div style={p.statItem}>
                                <p style={p.statVal}>CNN</p>
                                <p style={p.statLabel}>Arsitektur</p>
                            </div>
                            <div style={p.statItem}>
                                <p style={p.statVal}>{"< 5 dtk"}</p>
                                <p style={p.statLabel}>Waktu proses</p>
                            </div>
                            <div style={p.statItem}>
                                <p style={p.statVal}>4</p>
                                <p style={p.statLabel}>Kelas penyakit</p>
                            </div>
                            <div style={p.statItem}>
                                <p style={p.statVal}>1000+</p>
                                <p style={p.statLabel}>Data latih</p>
                            </div>
                        </div>
                    </div>

                    {/* How it works mini */}
                    <div style={{ ...p.infoCard, background: "#f0fdf4", borderColor: "#dcfce7" }}>
                        <h3 style={{ ...p.infoTitle, color: "#166534" }}>Cara Kerja</h3>
                        <div style={p.stepsList}>
                            {[
                                "Upload atau foto daun anggur",
                                "AI menganalisis pola pada daun",
                                "Hasil diagnosis ditampilkan",
                                "Lihat rekomendasi penanganan",
                            ].map((step, i) => (
                                <div key={i} style={p.stepRow}>
                                    <div style={p.stepNum}>{i + 1}</div>
                                    <span style={p.stepText}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const p = {
    wrapper: { minHeight: "100vh", background: "#f8fafc" },
    header: {
        textAlign: "center",
        padding: "90px 24px 60px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)",
    },
    label: {
        display: "inline-block", padding: "6px 16px", background: "#dcfce7", color: "#16a34a",
        fontSize: "13px", fontWeight: "700", borderRadius: "20px", letterSpacing: "1px", marginBottom: "16px"
    },
    title: { fontSize: "42px", fontWeight: "800", color: "#0f172a", margin: "0 0 20px", letterSpacing: "-0.5px" },
    subtitle: {
        fontSize: "18px", color: "#64748b", maxWidth: "600px",
        margin: "0 auto", lineHeight: 1.8,
    },
    mainGrid: {
        maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px",
        display: "grid", gridTemplateColumns: "1fr 360px", gap: "40px",
        alignItems: "start",
    },
    scanCol: {},
    scanCard: {
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "24px", padding: "32px",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)",
    },
    infoCol: { display: "flex", flexDirection: "column", gap: "24px" },
    infoCard: {
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.03)",
    },
    infoTitle: {
        fontSize: "20px", fontWeight: "800", color: "#0f172a",
        marginBottom: "20px", letterSpacing: "-0.5px"
    },
    tipList: {
        paddingLeft: "20px", margin: 0,
        display: "flex", flexDirection: "column", gap: "12px",
    },
    tipItem: {
        fontSize: "15px", color: "#64748b", lineHeight: 1.6,
    },
    diseaseList: { display: "flex", flexDirection: "column", gap: "12px" },
    diseaseTag: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#f8fafc", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.02)" },
    dot: { width: "12px", height: "12px", borderRadius: "50%", flexShrink: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
    diseaseName: { fontSize: "15px", fontWeight: "700", color: "#334155" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    statItem: {
        background: "#f8fafc", border: "1px solid rgba(0,0,0,0.03)",
        borderRadius: "16px", padding: "20px", textAlign: "center",
    },
    statVal: { fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" },
    statLabel: { fontSize: "13px", fontWeight: "600", color: "#64748b", margin: 0 },
    stepsList: { display: "flex", flexDirection: "column", gap: "16px" },
    stepRow: { display: "flex", alignItems: "flex-start", gap: "16px" },
    stepNum: {
        width: "32px", height: "32px", borderRadius: "10px",
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", fontWeight: "700", flexShrink: 0,
        boxShadow: "0 4px 10px -2px rgba(22, 163, 74, 0.4)"
    },
    stepText: { fontSize: "15px", color: "#475569", lineHeight: 1.5, marginTop: "4px" },
};

export default ScanPage;
