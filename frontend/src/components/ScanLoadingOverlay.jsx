import { useEffect, useState } from "react";

const messages = [
    "Mengunggah gambar...",
    "AI sedang menganalisis daun...",
    "Mendeteksi pola penyakit...",
    "Mencocokkan dengan database...",
    "Menyiapkan hasil diagnosis...",
];

function ScanLoadingOverlay({ visible }) {
    const [msgIndex, setMsgIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!visible) { setMsgIndex(0); setProgress(0); return; }
        const t1 = setInterval(() => setMsgIndex(i => (i + 1) % messages.length), 2200);
        const t2 = setInterval(() => setProgress(p => Math.min(p + 1.2, 92)), 120);
        return () => { clearInterval(t1); clearInterval(t2); };
    }, [visible]);

    if (!visible) return null;

    return (
        <div style={s.overlay}>
            <style>{keyframes}</style>
            <div style={s.card}>
                {/* Leaf scanner animation */}
                <div style={s.scannerWrap}>
                    <div style={s.leafCircle}>
                        <span style={s.leafEmoji}>🍃</span>
                    </div>
                    <div style={s.scanLine} />
                    <div style={s.pulseRing} />
                    <div style={s.pulseRing2} />
                </div>

                {/* Progress bar */}
                <div style={s.progressTrack}>
                    <div style={{ ...s.progressFill, width: `${progress}%` }} />
                </div>

                {/* Message */}
                <p style={s.message}>{messages[msgIndex]}</p>
                <p style={s.hint}>Mohon tunggu, proses ini membutuhkan beberapa detik</p>
            </div>
        </div>
    );
}

const keyframes = `
@keyframes leafSpin { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.15)} 100%{transform:rotate(360deg) scale(1)} }
@keyframes scanMove { 0%,100%{top:8px;opacity:.6} 50%{top:calc(100% - 12px);opacity:1} }
@keyframes pulse { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.2);opacity:0} }
@keyframes pulse2 { 0%{transform:scale(1);opacity:.3} 100%{transform:scale(2.8);opacity:0} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
`;

const s = {
    overlay: {
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    card: {
        background: "#ffffff", borderRadius: "28px", padding: "48px 40px 36px",
        textAlign: "center", maxWidth: "380px", width: "90%",
        boxShadow: "0 25px 60px -15px rgba(0,0,0,0.25)",
    },
    scannerWrap: {
        width: "120px", height: "120px", margin: "0 auto 28px",
        position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
    },
    leafCircle: {
        width: "90px", height: "90px", borderRadius: "50%",
        background: "linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px -6px rgba(22,163,74,0.25)",
        zIndex: 2,
    },
    leafEmoji: { fontSize: "42px", animation: "leafSpin 3s ease-in-out infinite" },
    scanLine: {
        position: "absolute", left: "10px", right: "10px", height: "3px",
        borderRadius: "2px", zIndex: 3,
        background: "linear-gradient(90deg,transparent,#16a34a,transparent)",
        animation: "scanMove 2s ease-in-out infinite",
    },
    pulseRing: {
        position: "absolute", inset: 0, borderRadius: "50%",
        border: "2px solid rgba(22,163,74,0.3)",
        animation: "pulse 2s ease-out infinite",
    },
    pulseRing2: {
        position: "absolute", inset: 0, borderRadius: "50%",
        border: "2px solid rgba(22,163,74,0.2)",
        animation: "pulse2 2s ease-out infinite 0.5s",
    },
    progressTrack: {
        width: "100%", height: "6px", borderRadius: "3px",
        background: "#f1f5f9", overflow: "hidden", marginBottom: "20px",
    },
    progressFill: {
        height: "100%", borderRadius: "3px", transition: "width 0.3s ease",
        background: "linear-gradient(90deg,#16a34a,#4ade80,#16a34a)",
        backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite",
    },
    message: {
        fontSize: "16px", fontWeight: "700", color: "#0f172a",
        margin: "0 0 8px", minHeight: "24px",
    },
    hint: { fontSize: "13px", color: "#94a3b8", margin: 0 },
};

export default ScanLoadingOverlay;
