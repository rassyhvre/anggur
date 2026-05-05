import { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Fungsi pembantu untuk membuat crop default
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            { unit: "%", width: 90 },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default function CropModal({ imageSrc, onCropComplete, onCancel }) {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    // Kunci aspect ratio 1:1
    const aspect = 1;

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
    }

    // Fungsi untuk generate file gambar dari hasil crop
    const generateCroppedImage = async () => {
        if (!completedCrop || !imgRef.current) return;

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        // Target resize ke 224x224 (untuk kebutuhan input TFLite)
        const targetSize = 224;
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.imageSmoothingQuality = "high";

        // Gambar porsi yang di-crop ke canvas (sekaligus resize ke 224x224)
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            targetSize,
            targetSize
        );

        // Convert ke format file (blob) untuk preview, dan return canvas-nya jika diperlukan
        canvas.toBlob((blob) => {
            if (!blob) return;
            // Generate File object
            const file = new File([blob], "cropped_leaf.jpg", { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(blob);
            
            // Return canvas juga untuk bisa langsung dibaca tensor
            onCropComplete(file, previewUrl, canvas);
        }, "image/jpeg", 0.95);
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h3 style={modalStyles.title}>Crop Gambar Daun (1:1)</h3>
                <p style={modalStyles.subtitle}>Posisikan daun di tengah kotak</p>
                
                <div style={modalStyles.cropWrapper}>
                    {imageSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            circularCrop={false}
                            locked={true} // Opsional, jika mau aspect terkunci absolut
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop me"
                                onLoad={onImageLoad}
                                style={{ maxHeight: "60vh", objectFit: "contain" }}
                            />
                        </ReactCrop>
                    )}
                </div>

                <div style={modalStyles.actions}>
                    <button onClick={onCancel} style={modalStyles.cancelBtn}>
                        Batal
                    </button>
                    <button 
                        onClick={generateCroppedImage} 
                        style={modalStyles.confirmBtn}
                        disabled={!completedCrop?.width || !completedCrop?.height}
                    >
                        Terapkan & Proses
                    </button>
                </div>
            </div>
        </div>
    );
}

const modalStyles = {
    overlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "20px",
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "24px",
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
    },
    title: { margin: "0 0 8px", fontSize: "20px", fontWeight: "700", color: "#0f172a" },
    subtitle: { margin: "0 0 20px", fontSize: "14px", color: "#64748b" },
    cropWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "24px",
    },
    actions: {
        display: "flex",
        gap: "12px",
        width: "100%",
        justifyContent: "flex-end",
    },
    cancelBtn: {
        padding: "10px 20px", borderRadius: "8px",
        border: "1px solid #cbd5e1", backgroundColor: "#fff",
        color: "#475569", fontWeight: "600", cursor: "pointer",
    },
    confirmBtn: {
        padding: "10px 20px", borderRadius: "8px",
        border: "none", backgroundColor: "#16a34a",
        color: "#fff", fontWeight: "600", cursor: "pointer",
    },
};
