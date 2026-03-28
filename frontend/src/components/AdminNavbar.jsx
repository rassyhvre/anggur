import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminNavbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav style={s.nav}>
            <div style={s.inner}>
                <div style={s.brand} onClick={() => { navigate("/admin"); closeMenu(); }}>
                    <span style={{ fontSize: "20px" }}>🛡️</span>
                    <span style={s.brandText}>Admin Panel</span>
                </div>

                <button
                    className="admin-hamburger"
                    style={s.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                        {menuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>

                <div className={`admin-links${menuOpen ? " open" : ""}`} style={s.links}>
                    {[
                        { to: "/admin", label: "Dashboard", end: true },
                        { to: "/admin/pengguna", label: "Pengguna" },
                        { to: "/admin/penyakit", label: "Penyakit" },
                        { to: "/admin/penanganan", label: "Penanganan" },
                        { to: "/admin/deteksi", label: "Deteksi" },
                    ].map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={closeMenu}
                            style={({ isActive }) => ({
                                ...s.link,
                                ...(isActive ? s.linkActive : {}),
                            })}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
                <div className={`admin-auth${menuOpen ? " open" : ""}`} style={s.authArea}>
                    <button onClick={() => { navigate("/"); closeMenu(); }} style={s.homeBtn}>🌐 Site</button>
                    <button onClick={() => { handleLogout(); closeMenu(); }} style={s.logoutBtn}>Logout</button>
                </div>
            </div>
        </nav>
    );
}

const s = {
    nav: {
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#1e293b", height: "56px",
        borderBottom: "1px solid #334155",
    },
    inner: {
        maxWidth: "1200px", margin: "0 auto", padding: "0 20px",
        height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
    },
    brand: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
    brandText: { fontSize: "16px", fontWeight: "800", color: "#f1f5f9" },
    hamburger: {
        display: "none", alignItems: "center", justifyContent: "center",
        background: "none", border: "none", cursor: "pointer", padding: "4px",
    },
    links: { display: "flex", gap: "2px" },
    link: {
        color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: "600",
        padding: "6px 12px", borderRadius: "6px", transition: "all 0.15s",
    },
    linkActive: { color: "#ffffff", background: "#15803d" },
    authArea: { display: "flex", gap: "8px", flexShrink: 0 },
    homeBtn: {
        padding: "6px 14px", border: "1px solid #475569", borderRadius: "6px",
        background: "transparent", color: "#94a3b8", fontSize: "12px", fontWeight: "600", cursor: "pointer",
    },
    logoutBtn: {
        padding: "6px 14px", border: "1px solid #7f1d1d", borderRadius: "6px",
        background: "#7f1d1d33", color: "#fca5a5", fontSize: "12px", fontWeight: "600", cursor: "pointer",
    },
};

export default AdminNavbar;
