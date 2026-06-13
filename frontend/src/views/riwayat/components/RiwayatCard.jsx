import { useState } from "react";

function RiwayatCard({ item }) {
    const [expanded, setExpanded] = useState(false);

    const statusColor = item.nama_penyakit === "Healthy"
        ? { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" }
        : { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" };

    return (
        <div style={c.card}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 28px -8px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 12px -4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            
            {/* Main Row */}
            <div style={c.mainRow} onClick={() => setExpanded(!expanded)}>
                <img
                    src={`http://localhost:5000/uploads/${item.gambar_upload}`}
                    alt="Hasil deteksi"
                    style={c.img}
                />
                <div style={c.info}>
                    <div style={c.topRow}>
                        <h4 style={c.penyakit}>{item.nama_penyakit}</h4>
                        <span style={{
                            ...c.statusBadge,
                            background: statusColor.bg,
                            color: statusColor.color,
                            border: `1px solid ${statusColor.border}`,
                        }}>
                            {item.nama_penyakit === "Healthy" ? "Sehat" : "Terinfeksi"}
                        </span>
                    </div>
                    <div style={c.meta}>
                        <span style={c.confidence}>
                            🎯 {(item.tingkat_keyakinan * 100).toFixed(1)}%
                        </span>
                        <span style={c.dot}>·</span>
                        <span style={c.tanggal}>
                            📅 {new Date(item.tanggal_deteksi).toLocaleDateString("id-ID", {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </span>
                    </div>
                    <button style={c.detailToggle}>
                        {expanded ? "Sembunyikan Detail ▲" : "Lihat Detail ▼"}
                    </button>
                </div>
            </div>

            {/* Expandable Detail Section */}
            <div style={{
                ...c.detailSection,
                maxHeight: expanded ? "600px" : "0",
                opacity: expanded ? 1 : 0,
                marginTop: expanded ? "16px" : "0",
                padding: expanded ? "20px" : "0 20px",
            }}>
                {/* Detail Grid */}
                <div style={c.detailGrid}>
                    <div style={c.detailItem}>
                        <span style={c.detailLabel}>Penyakit</span>
                        <span style={c.detailValue}>{item.nama_penyakit}</span>
                    </div>
                    <div style={c.detailItem}>
                        <span style={c.detailLabel}>Tingkat Keyakinan</span>
                        <span style={c.detailValue}>{(item.tingkat_keyakinan * 100).toFixed(1)}%</span>
                    </div>
                    <div style={c.detailItem}>
                        <span style={c.detailLabel}>Tanggal Deteksi</span>
                        <span style={c.detailValue}>
                            {new Date(item.tanggal_deteksi).toLocaleDateString("id-ID", {
                                weekday: "long", day: "numeric", month: "long", year: "numeric",
                            })}
                        </span>
                    </div>
                    <div style={c.detailItem}>
                        <span style={c.detailLabel}>Waktu</span>
                        <span style={c.detailValue}>
                            {new Date(item.tanggal_deteksi).toLocaleTimeString("id-ID", {
                                hour: "2-digit", minute: "2-digit",
                            })} WIB
                        </span>
                    </div>
                </div>

                {/* Confidence Bar */}
                <div style={{ marginTop: "16px" }}>
                    <div style={c.barLabel}>
                        <span>Confidence Level</span>
                        <span style={{ fontWeight: "700", color: "#0f172a" }}>
                            {(item.tingkat_keyakinan * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div style={c.barBg}>
                        <div style={{
                            ...c.barFill,
                            width: expanded ? `${item.tingkat_keyakinan * 100}%` : "0%",
                            background: item.tingkat_keyakinan > 0.8
                                ? "linear-gradient(90deg, #22c55e, #16a34a)"
                                : item.tingkat_keyakinan > 0.5
                                    ? "linear-gradient(90deg, #eab308, #ca8a04)"
                                    : "linear-gradient(90deg, #ef4444, #dc2626)",
                        }} />
                    </div>
                </div>

                {/* Larger Image Preview */}
                <div style={{ marginTop: "16px" }}>
                    <p style={c.detailLabel}>Gambar yang Dianalisis</p>
                    <img
                        src={`http://localhost:5000/uploads/${item.gambar_upload}`}
                        alt="Preview gambar"
                        style={c.previewImg}
                    />
                </div>

                {/* Penanganan if available */}
                {item.penanganan && item.penanganan.length > 0 && (
                    <div style={{ marginTop: "16px" }}>
                        <p style={{ ...c.detailLabel, marginBottom: "10px" }}>Rekomendasi Penanganan</p>
                        {item.penanganan.map((p, i) => (
                            <div key={i} style={c.penangananItem}>
                                <div style={c.penangananNum}>{i + 1}</div>
                                <div>
                                    <p style={c.penangananJudul}>{p.judul || p.nama_penanganan}</p>
                                    <p style={c.penangananDesc}>{p.deskripsi}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Model info */}
                <div style={c.modelInfo}>
                    <span>🤖 Dianalisis menggunakan model CNN Deep Learning</span>
                </div>
            </div>
        </div>
    );
}

const c = {
    card: {
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "20px",
        padding: "16px",
        transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
        cursor: "pointer",
        boxShadow: "0 4px 12px -4px rgba(0,0,0,0.04)",
    },
    mainRow: {
        display: "flex", gap: "16px", alignItems: "center",
    },
    img: {
        width: "72px", height: "72px",
        objectFit: "cover", borderRadius: "14px",
        border: "1px solid rgba(0,0,0,0.04)", flexShrink: 0,
    },
    info: { flex: 1 },
    topRow: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px",
    },
    penyakit: {
        fontSize: "16px", fontWeight: "800",
        color: "#0f172a", margin: 0, letterSpacing: "-0.3px",
    },
    statusBadge: {
        fontSize: "11px", fontWeight: "700", padding: "3px 10px",
        borderRadius: "20px", letterSpacing: "0.3px",
    },
    meta: {
        display: "flex", alignItems: "center", gap: "8px",
        fontSize: "13px", color: "#64748b", marginBottom: "8px",
    },
    confidence: { color: "#16a34a", fontWeight: "600" },
    dot: { color: "#d1d5db" },
    tanggal: {},
    detailToggle: {
        background: "none", border: "none", color: "#7e22ce",
        fontSize: "13px", fontWeight: "700", cursor: "pointer",
        padding: 0, fontFamily: "inherit",
    },
    detailSection: {
        overflow: "hidden",
        borderTop: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "0 0 16px 16px",
        background: "#fafbfc",
        borderRadius: "16px",
        transition: "all 0.4s cubic-bezier(0.33,1,0.68,1)",
    },
    detailGrid: {
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "12px",
    },
    detailItem: {
        display: "flex", flexDirection: "column", gap: "2px",
    },
    detailLabel: {
        fontSize: "12px", fontWeight: "700", color: "#94a3b8",
        textTransform: "uppercase", letterSpacing: "0.5px",
    },
    detailValue: {
        fontSize: "14px", fontWeight: "600", color: "#0f172a",
    },
    barLabel: {
        display: "flex", justifyContent: "space-between",
        fontSize: "12px", color: "#64748b", marginBottom: "6px",
        fontWeight: "600",
    },
    barBg: {
        width: "100%", height: "8px", borderRadius: "4px",
        background: "#e2e8f0", overflow: "hidden",
    },
    barFill: {
        height: "100%", borderRadius: "4px",
        transition: "width 1s cubic-bezier(0.33,1,0.68,1)",
    },
    previewImg: {
        width: "100%", maxHeight: "220px",
        objectFit: "cover", borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.04)",
        marginTop: "8px",
    },
    penangananItem: {
        display: "flex", gap: "12px", alignItems: "flex-start",
        padding: "12px", background: "#f0fdf4",
        borderRadius: "12px", marginBottom: "8px",
        border: "1px solid #dcfce7",
    },
    penangananNum: {
        width: "28px", height: "28px", borderRadius: "50%",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "#fff", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "12px",
        fontWeight: "700", flexShrink: 0,
    },
    penangananJudul: {
        fontSize: "14px", fontWeight: "700", color: "#0f172a",
        margin: "0 0 2px",
    },
    penangananDesc: {
        fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.5,
    },
    modelInfo: {
        marginTop: "16px", padding: "10px 14px",
        background: "linear-gradient(135deg, #f3e8ff, #faf5ff)",
        borderRadius: "10px", fontSize: "12px", color: "#7e22ce",
        fontWeight: "600", border: "1px solid #e9d5ff",
    },
};

export default RiwayatCard;
