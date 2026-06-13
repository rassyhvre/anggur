import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const links = [
        { to: "/admin", label: "Dashboard", end: true, icon: "📊" },
        { to: "/admin/pengguna", label: "Pengguna", icon: "👥" },
        { to: "/admin/penyakit", label: "Penyakit", icon: "🦠" },
        { to: "/admin/penanganan", label: "Penanganan", icon: "💊" },
        { to: "/admin/deteksi", label: "Deteksi", icon: "🔍" },
    ];

    return (
        <nav style={s.nav}>
            <div style={s.inner}>
                <div style={s.brand} onClick={() => { navigate("/admin"); closeMenu(); }}>
                    <div style={s.brandIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <span style={s.brandText}>Admin Panel</span>
                </div>

                <button
                    className="admin-hamburger"
                    style={s.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle admin menu"
                >
                    <span style={{
                        display: "block", width: "20px", height: "2px",
                        background: menuOpen ? "transparent" : "#94a3b8",
                        borderRadius: "2px", position: "relative",
                        transition: "all 0.3s cubic-bezier(0.33, 1, 0.68, 1)",
                    }}>
                        <span style={{
                            content: "''", position: "absolute", left: 0,
                            width: "20px", height: "2px", background: "#94a3b8",
                            borderRadius: "2px",
                            top: menuOpen ? 0 : "-6px",
                            transform: menuOpen ? "rotate(45deg)" : "none",
                            transition: "all 0.3s cubic-bezier(0.33, 1, 0.68, 1)",
                        }} />
                        <span style={{
                            content: "''", position: "absolute", left: 0,
                            width: "20px", height: "2px", background: "#94a3b8",
                            borderRadius: "2px",
                            top: menuOpen ? 0 : "6px",
                            transform: menuOpen ? "rotate(-45deg)" : "none",
                            transition: "all 0.3s cubic-bezier(0.33, 1, 0.68, 1)",
                        }} />
                    </span>
                </button>

                <div className={`admin-links${menuOpen ? " open" : ""}`} style={s.links}>
                    {links.map((item) => (
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
                            <span style={{ fontSize: "14px" }}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className={`admin-auth${menuOpen ? " open" : ""}`} style={s.authArea}>
                    <button onClick={() => { navigate("/"); closeMenu(); }} style={s.homeBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: "6px" }}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        Site
                    </button>
                    <button onClick={() => { handleLogout(); closeMenu(); }} style={s.logoutBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: "6px" }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

const s = {
    nav: {
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        height: "64px",
        borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
        animation: "navSlideDown 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
    },
    inner: {
        maxWidth: "1280px", margin: "0 auto", padding: "0 24px",
        height: "64px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "16px",
    },
    brand: {
        display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
        transition: "transform 0.15s cubic-bezier(0.33, 1, 0.68, 1)",
    },
    brandIcon: {
        width: "32px", height: "32px", borderRadius: "8px",
        background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px -2px rgba(22, 163, 74, 0.4)",
    },
    brandText: {
        fontSize: "16px", fontWeight: "800", color: "#f1f5f9",
        letterSpacing: "-0.3px",
    },
    hamburger: {
        display: "none", alignItems: "center", justifyContent: "center",
        background: "none", border: "none", cursor: "pointer",
        padding: "8px", borderRadius: "8px",
        transition: "background 0.15s ease",
    },
    links: {
        display: "flex", gap: "4px",
    },
    link: {
        color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: "600",
        padding: "8px 14px", borderRadius: "8px",
        transition: "all 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
        display: "flex", alignItems: "center", gap: "6px",
    },
    linkActive: {
        color: "#ffffff",
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
        boxShadow: "0 4px 12px -2px rgba(22, 163, 74, 0.35)",
    },
    authArea: {
        display: "flex", gap: "8px", flexShrink: 0,
    },
    homeBtn: {
        padding: "8px 16px", border: "1px solid rgba(71, 85, 105, 0.6)",
        borderRadius: "8px", background: "transparent",
        color: "#94a3b8", fontSize: "13px", fontWeight: "600",
        cursor: "pointer", display: "flex", alignItems: "center",
        transition: "all 0.15s ease",
    },
    logoutBtn: {
        padding: "8px 16px", border: "1px solid rgba(127, 29, 29, 0.5)",
        borderRadius: "8px", background: "rgba(127, 29, 29, 0.15)",
        color: "#fca5a5", fontSize: "13px", fontWeight: "600",
        cursor: "pointer", display: "flex", alignItems: "center",
        transition: "all 0.15s ease",
    },
};

export default AdminNavbar;
