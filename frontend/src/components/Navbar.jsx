import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isHome = location.pathname === "/";

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Show/hide navbar based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }

        // Solid background after 40px scroll
        setScrolled(currentScrollY > 40);
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const closeMenu = () => setMenuOpen(false);

    const navLinks = [
        { to: "/", label: "Beranda", end: true },
        { to: "/scan", label: "Scan" },
        ...(token ? [{ to: "/riwayat", label: "Riwayat" }] : []),
        { to: "/tentang", label: "Tentang" },
    ];

    const shouldBeTransparent = isHome && !scrolled && !menuOpen;

    return (
        <>
            <nav
                className={`navbar ${shouldBeTransparent ? "navbar--transparent" : "navbar--solid"}`}
                style={{
                    transform: hidden && !menuOpen ? "translateY(-100%)" : "translateY(0)",
                }}
            >
                <div className="navbar__inner">
                    {/* Brand */}
                    <div
                        className="navbar__brand"
                        onClick={() => { navigate("/"); closeMenu(); }}
                    >
                        <img
                            src="/logo.png"
                            alt="AgroScan Logo"
                            className="navbar__brand-logo"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <svg width="32" height="32" viewBox="0 0 28 28" fill="none" style={{ display: "none" }}>
                            <defs>
                                <linearGradient id="leaf-grad" x1="0" y1="0" x2="28" y2="28">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="100%" stopColor="#15803d" />
                                </linearGradient>
                            </defs>
                            <rect width="28" height="28" rx="8" fill="url(#leaf-grad)" />
                            <path d="M9 18c0-5 3-9 8-10-2 3-3 6-3 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            <path d="M13 18c0-3 2-6 5-7" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="navbar__brand-text">
                            <span className="navbar__brand-text--green">Agro</span>
                            <span className="navbar__brand-text--purple">Scan</span>
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="navbar__links">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `navbar__link ${isActive ? "navbar__link--active" : ""}`
                                }
                                style={shouldBeTransparent ? { color: "rgba(255,255,255,0.85)" } : undefined}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="navbar__auth">
                        {token && user ? (
                            <>
                                {user.role === "admin" && (
                                    <button
                                        onClick={() => { navigate("/admin"); closeMenu(); }}
                                        className="navbar__btn navbar__btn--admin"
                                    >
                                        ⚙️ Admin
                                    </button>
                                )}
                                <div className="navbar__avatar">
                                    {user.nama?.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={() => { handleLogout(); closeMenu(); }}
                                    className="navbar__btn navbar__btn--logout"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { navigate("/login"); closeMenu(); }}
                                    className="navbar__btn navbar__btn--ghost"
                                >
                                    Masuk
                                </button>
                                <button
                                    onClick={() => { navigate("/register"); closeMenu(); }}
                                    className="navbar__btn navbar__btn--primary"
                                >
                                    Daftar
                                </button>
                            </>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--active" : ""}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span
                            className="navbar__hamburger-line"
                            style={shouldBeTransparent ? {
                                background: menuOpen ? "transparent" : "rgba(255,255,255,0.9)"
                            } : undefined}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`navbar__mobile-menu ${menuOpen ? "open" : ""}`}>
                <div className="navbar__mobile-links">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `navbar__mobile-link ${isActive ? "navbar__mobile-link--active" : ""}`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
                <div className="navbar__mobile-auth">
                    {token && user ? (
                        <>
                            {user.role === "admin" && (
                                <button
                                    onClick={() => { navigate("/admin"); closeMenu(); }}
                                    className="navbar__btn navbar__btn--admin"
                                >
                                    ⚙️ Admin Panel
                                </button>
                            )}
                            <button
                                onClick={() => { handleLogout(); closeMenu(); }}
                                className="navbar__btn navbar__btn--logout"
                            >
                                Keluar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { navigate("/login"); closeMenu(); }}
                                className="navbar__btn navbar__btn--ghost"
                            >
                                Masuk
                            </button>
                            <button
                                onClick={() => { navigate("/register"); closeMenu(); }}
                                className="navbar__btn navbar__btn--primary"
                            >
                                Daftar Gratis
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;
