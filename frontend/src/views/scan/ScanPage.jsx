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
    wrapper: { minHeight: "100vh", background: "#fff" },
    header: {
        textAlign: "center",
        padding: "100px 24px 40px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #fff 100%)",
    },
    label: { color: "#16a34a", fontSize: "12px", fontWeight: "600", letterSpacing: "1.5px" },
    title: { fontSize: "30px", fontWeight: "700", color: "#111", margin: "8px 0 10px" },
    subtitle: {
        fontSize: "15px", color: "#777", maxWidth: "480px",
        margin: "0 auto", lineHeight: 1.6,
    },
    mainGrid: {
        maxWidth: "1000px", margin: "0 auto", padding: "0 24px 60px",
        display: "grid", gridTemplateColumns: "1fr 300px", gap: "28px",
        alignItems: "start",
    },
    scanCol: {},
    scanCard: {
        background: "#fff", border: "1px solid #eee",
        borderRadius: "14px", padding: "24px",
    },
    infoCol: { display: "flex", flexDirection: "column", gap: "16px" },
    infoCard: {
        background: "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: "12px",
        padding: "20px",
    },
    infoTitle: {
        fontSize: "14px", fontWeight: "600", color: "#111",
        marginBottom: "14px",
    },
    tipList: {
        listStyle: "none", padding: 0, margin: 0,
        display: "flex", flexDirection: "column", gap: "8px",
    },
    tipItem: {
        fontSize: "13px", color: "#666", lineHeight: 1.5,
        paddingLeft: "16px",
        position: "relative",
    },
    diseaseList: { display: "flex", flexDirection: "column", gap: "8px" },
    diseaseTag: { display: "flex", alignItems: "center", gap: "8px" },
    dot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
    diseaseName: { fontSize: "13px", color: "#444" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    statItem: {
        background: "#fff", border: "1px solid #eee",
        borderRadius: "8px", padding: "12px", textAlign: "center",
    },
    statVal: { fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "2px" },
    statLabel: { fontSize: "11px", color: "#999", margin: 0 },
    stepsList: { display: "flex", flexDirection: "column", gap: "10px" },
    stepRow: { display: "flex", alignItems: "center", gap: "10px" },
    stepNum: {
        width: "24px", height: "24px", borderRadius: "50%",
        background: "#16a34a", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: "600", flexShrink: 0,
    },
    stepText: { fontSize: "13px", color: "#444" },
};

export default ScanPage;
