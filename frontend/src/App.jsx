import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import HomePage from "./views/home/HomePage";
import ScanPage from "./views/scan/ScanPage";
import RiwayatPage from "./views/riwayat/RiwayatPage";
import TentangPage from "./views/tentang/TentangPage";
import ProfilePage from "./views/profile/ProfilePage";
import LoginPage from "./views/auth/LoginPage";
import RegisterPage from "./views/auth/RegisterPage";
import AdminDashboard from "./views/admin/AdminDashboard";
import PenggunaAdmin from "./views/admin/PenggunaAdmin";
import PenyakitAdmin from "./views/admin/PenyakitAdmin";
import PenangananAdmin from "./views/admin/PenangananAdmin";
import DeteksiAdmin from "./views/admin/DeteksiAdmin";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token) return <Navigate to="/login" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;
    return children;
}

function AdminLayout() {
    return (
        <>
            <AdminNavbar />
            <div style={{ paddingTop: "56px", minHeight: "100vh", background: "#f1f5f9" }}>
                <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="pengguna" element={<PenggunaAdmin />} />
                    <Route path="penyakit" element={<PenyakitAdmin />} />
                    <Route path="penanganan" element={<PenangananAdmin />} />
                    <Route path="deteksi" element={<DeteksiAdmin />} />
                </Routes>
            </div>
        </>
    );
}

function PublicLayout() {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: "64px" }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/tentang" element={<TentangPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/riwayat" element={<ProtectedRoute><RiwayatPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
                <Route path="/*" element={<PublicLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
