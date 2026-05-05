import { useState, useEffect } from "react";
import { getDeteksiDetail } from "../../../services/api";

function RiwayatDetailModal({ id, onClose }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const data = await getDeteksiDetail(id);
                setDetail(data);
            } catch (err) {
                console.error(err);
                alert("Gagal memuat detail diagnosis");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (!id) return null;

    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={(e) => e.stopPropagation()}>
                <button style={s.closeBtn} onClick={onClose}>&times;</button>
                
                {loading ? (
                    <div style={s.loadingWrap}>
                        <p>Memuat detail...</p>
                    </div>
                ) : detail && (
                    <div style={s.content}>
                        <img 
                            src={`http://localhost:5000/uploads/${detail.gambar_upload}`} 
                            alt={detail.nama_penyakit} 
                            style={s.img} 
                        />
                        
                        <div style={s.body}>
                            <div style={s.header}>
                                <h2 style={s.penyakit}>{detail.nama_penyakit}</h2>
                                <span style={{
                                    ...s.badge,
                                    background: detail.nama_penyakit.toLowerCase() === 'healthy' ? '#dcfce7' : '#fee2e2',
                                    color: detail.nama_penyakit.toLowerCase() === 'healthy' ? '#166534' : '#991b1b'
                                }}>
                                    {detail.nama_penyakit.toLowerCase() === 'healthy' ? '✅ Sehat' : '⚠️ Terinfeksi'}
                                </span>
                            </div>

                            <div style={s.metaGrid}>
                                <div style={s.metaItem}>
                                    <span style={s.metaLabel}>Akurasi AI</span>
                                    <span style={s.metaValue}>{(detail.tingkat_keyakinan * 100).toFixed(1)}%</span>
                                </div>
                                <div style={s.metaItem}>
                                    <span style={s.metaLabel}>Tanggal</span>
                                    <span style={s.metaValue}>
                                        {new Date(detail.tanggal_deteksi).toLocaleDateString("id-ID", {
                                            day: "numeric", month: "long", year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>

                            <hr style={s.hr} />

                            <div style={s.section}>
                                <h3 style={s.sectionTitle}>Deskripsi</h3>
                                <p style={s.text}>{detail.deskripsi || "Tidak ada deskripsi tersedia."}</p>
                            </div>

                            <div style={s.section}>
                                <h3 style={s.sectionTitle}>Penyebab</h3>
                                <p style={s.text}>{detail.penyebab || "Data penyebab tidak tersedia."}</p>
                            </div>

                            {detail.penanganan && detail.penanganan.length > 0 && (
                                <div style={s.section}>
                                    <h3 style={s.sectionTitle}>Langkah Penanganan</h3>
                                    <div style={s.steps}>
                                        {detail.penanganan.map((step, i) => (
                                            <div key={i} style={s.stepItem}>
                                                <div style={s.stepNum}>{i + 1}</div>
                                                <div style={s.stepContent}>
                                                    <h4 style={s.stepTitle}>{step.judul_penanganan}</h4>
                                                    <p style={s.stepDesc}>{step.deskripsi_penanganan}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const s = {
    overlay: {
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    },
    modal: {
        background: "#fff", borderRadius: "24px", maxWidth: "500px", width: "100%",
        maxHeight: "90vh", overflowY: "auto", position: "relative",
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    },
    closeBtn: {
        position: "absolute", top: "16px", right: "16px",
        width: "32px", height: "32px", borderRadius: "50%",
        border: "none", background: "#f3f4f6", fontSize: "20px",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10,
    },
    loadingWrap: { padding: "60px", textAlign: "center", color: "#6b7280" },
    content: {},
    img: { width: "100%", height: "240px", objectFit: "cover" },
    body: { padding: "24px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
    penyakit: { fontSize: "22px", fontWeight: "800", color: "#111827", margin: 0 },
    badge: { padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "700" },
    metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
    metaItem: { background: "#f9fafb", padding: "12px", borderRadius: "12px", border: "1px solid #f3f4f6" },
    metaLabel: { display: "block", fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" },
    metaValue: { fontSize: "14px", fontWeight: "700", color: "#374151" },
    hr: { border: "none", borderTop: "1px solid #f3f4f6", margin: "0 0 20px" },
    section: { marginBottom: "20px" },
    sectionTitle: { fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "8px" },
    text: { fontSize: "14px", color: "#4b5563", lineHeight: 1.6, margin: 0 },
    steps: { display: "flex", flexDirection: "column", gap: "12px" },
    stepItem: { display: "flex", gap: "12px" },
    stepNum: {
        width: "24px", height: "24px", borderRadius: "6px", background: "#16a34a",
        color: "#fff", fontSize: "12px", fontWeight: "700",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 2px" },
    stepDesc: { fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.5 },
};

export default RiwayatDetailModal;
