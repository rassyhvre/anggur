import { useState, useEffect } from "react";
import { getProfile, updateProfilePhoto } from "../../services/api";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await getProfile();
            setUser(res.data);
            // Update localStorage just in case
            localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            await updateProfilePhoto(file);
            await fetchProfile();
            alert("Foto profil berhasil diperbarui!");
        } catch (err) {
            console.error(err);
            alert("Gagal mengunggah foto profil");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div style={s.center}>Memuat profil...</div>;

    const photoUrl = user?.foto_profil 
        ? `http://localhost:5000/uploads/${user.foto_profil}` 
        : null;

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.header}>
                    <h1 style={s.title}>Pengaturan Akun</h1>
                    <p style={s.subtitle}>Kelola informasi profil dan foto Anda</p>
                </div>

                <div style={s.profileSection}>
                    <div style={s.avatarWrapper}>
                        <div style={s.avatar}>
                            {photoUrl ? (
                                <img src={photoUrl} alt={user?.nama} style={s.avatarImg} />
                            ) : (
                                <span style={s.avatarInitial}>
                                    {user?.nama?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <label style={s.uploadBtn}>
                            {uploading ? "..." : "📸"}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                style={{ display: "none" }} 
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <div style={s.info}>
                        <div style={s.field}>
                            <label style={s.label}>Nama Lengkap</label>
                            <div style={s.value}>{user?.nama}</div>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Alamat Email</label>
                            <div style={s.value}>{user?.email}</div>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Role Pengguna</label>
                            <div style={{ ...s.value, textTransform: "capitalize" }}>{user?.role || "User"}</div>
                        </div>
                    </div>
                </div>

                <div style={s.actions}>
                    <p style={s.hint}>Fitur ubah nama dan password akan tersedia segera.</p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { 
        padding: "40px 24px", 
        display: "flex", 
        justifyContent: "center",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
        minHeight: "calc(100vh - 64px)",
    },
    card: { 
        maxWidth: "500px", width: "100%", 
        background: "#fff", padding: "40px", 
        borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        height: "fit-content"
    },
    header: { textAlign: "center", marginBottom: "40px" },
    title: { fontSize: "24px", fontWeight: "800", color: "#111827", margin: "0 0 8px" },
    subtitle: { fontSize: "14px", color: "#6b7280" },
    profileSection: { display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
    avatarWrapper: { position: "relative" },
    avatar: { 
        width: "120px", height: "120px", borderRadius: "50%", 
        background: "#dcfce7", border: "4px solid #fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
    },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
    avatarInitial: { fontSize: "48px", fontWeight: "700", color: "#166534" },
    uploadBtn: {
        position: "absolute", bottom: "4px", right: "4px",
        width: "36px", height: "36px", borderRadius: "50%",
        background: "#16a34a", border: "3px solid #fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: "16px", color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    },
    info: { width: "100%", display: "flex", flexDirection: "column", gap: "20px" },
    field: { borderBottom: "1px solid #f3f4f6", paddingBottom: "12px" },
    label: { display: "block", fontSize: "12px", color: "#9ca3af", fontWeight: "700", textTransform: "uppercase", marginBottom: "4px" },
    value: { fontSize: "16px", color: "#111827", fontWeight: "500" },
    actions: { marginTop: "40px", textAlign: "center" },
    hint: { fontSize: "12px", color: "#9ca3af" },
    center: { padding: "100px", textAlign: "center", color: "#6b7280" }
};

export default ProfilePage;
