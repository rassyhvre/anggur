import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
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
                <div style={s.brand} onClick={() => { navigate("/"); closeMenu(); }}>
                    <img
                        src="/logo.png"
                        alt="AgroScan Logo"
                        style={{ height: "36px", width: "auto", objectFit: "contain" }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ display: "none" }}>
                        <rect width="28" height="28" rx="7" fill="#16a34a" />
                        <path d="M9 18c0-5 3-9 8-10-2 3-3 6-3 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        <path d="M13 18c0-3 2-6 5-7" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span style={s.brandText}>
                        <span style={{ color: "#2ea043" }}>Agro</span><span style={{ color: "#7e22ce" }}>Scan</span>
                    </span>
                </div>

                <button
                    className="hamburger-btn"
                    style={s.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
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

                <div className={`navbar-links${menuOpen ? " open" : ""}`} style={s.links}>
                    {[
                        { to: "/", label: "Beranda" },
                        { to: "/scan", label: "Scan" },
                        ...(token ? [{ to: "/riwayat", label: "Riwayat" }] : []),
                        { to: "/tentang", label: "Tentang" },
                    ].map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            onClick={closeMenu}
                            style={({ isActive }) => ({
                                ...s.link,
                                color: isActive ? "#16a34a" : "#555",
                                fontWeight: isActive ? "600" : "400",
                                borderBottom: isActive ? "2px solid #16a34a" : "2px solid transparent",
                            })}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className={`navbar-auth${menuOpen ? " open" : ""}`} style={s.auth}>
                    {token && user ? (
                        <div style={s.userArea}>
                            {user.role === "admin" && (
                                <button onClick={() => { navigate("/admin"); closeMenu(); }} style={s.adminBtn}>Admin</button>
                            )}
                            <div style={s.avatar}>{user.nama?.charAt(0).toUpperCase()}</div>
                            <button onClick={() => { handleLogout(); closeMenu(); }} style={s.logoutBtn}>Keluar</button>
                        </div>
                    ) : (
                        <div style={s.authBtns}>
                            <button onClick={() => { navigate("/login"); closeMenu(); }} style={s.loginBtn}>Masuk</button>
                            <button onClick={() => { navigate("/register"); closeMenu(); }} style={s.registerBtn}>Daftar</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

const s = {
    nav: {
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
    },
    inner: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 28px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
    },
    brandText: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#111",
    },
    hamburger: {
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px",
    },
    links: {
        display: "flex",
        gap: "4px",
    },
    link: {
        fontSize: "14px",
        padding: "20px 14px",
        textDecoration: "none",
        transition: "color 0.2s",
    },
    auth: { flexShrink: 0 },
    authBtns: { display: "flex", gap: "8px", alignItems: "center" },
    userArea: { display: "flex", alignItems: "center", gap: "8px" },
    avatar: {
        width: "32px", height: "32px",
        borderRadius: "50%",
        background: "#dcfce7",
        color: "#166534",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "600",
    },
    loginBtn: {
        padding: "7px 18px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        background: "transparent",
        color: "#374151",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },
    registerBtn: {
        padding: "7px 18px",
        border: "none",
        borderRadius: "7px",
        background: "#16a34a",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
    logoutBtn: {
        padding: "6px 14px",
        border: "1px solid #e5e7eb",
        borderRadius: "7px",
        background: "#fff",
        color: "#6b7280",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
    },
    adminBtn: {
        padding: "6px 14px",
        border: "1px solid #c7d2fe",
        borderRadius: "7px",
        background: "#eef2ff",
        color: "#4338ca",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
    },
};

export default Navbar;
