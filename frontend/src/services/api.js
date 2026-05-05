import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor: otomatis tambahkan token ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = async (nama, email, password) => {
    const response = await api.post("/api/auth/register", { nama, email, password });
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
};

export const updateProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await api.post("/api/auth/profile/photo", formData);
    return response.data;
};

// Deteksi
export const detectDisease = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/deteksi/predict", formData);
    return response.data;
};

// Riwayat
export const getRiwayat = async () => {
    const response = await api.get("/api/deteksi/riwayat");
    return response.data.data;
};

export const getDeteksiDetail = async (id) => {
    const response = await api.get(`/api/deteksi/${id}`);
    return response.data.data;
};

// ============ ADMIN API ============
// Pengguna
export const adminGetPengguna = async () => (await api.get("/api/admin/pengguna")).data.data;
export const adminUpdatePengguna = async (id, data) => (await api.put(`/api/admin/pengguna/${id}`, data)).data;
export const adminDeletePengguna = async (id) => (await api.delete(`/api/admin/pengguna/${id}`)).data;

// Penyakit
export const adminGetPenyakit = async () => (await api.get("/api/admin/penyakit")).data.data;
export const adminCreatePenyakit = async (data) => (await api.post("/api/admin/penyakit", data)).data;
export const adminUpdatePenyakit = async (id, data) => (await api.put(`/api/admin/penyakit/${id}`, data)).data;
export const adminDeletePenyakit = async (id) => (await api.delete(`/api/admin/penyakit/${id}`)).data;

// Penanganan
export const adminGetPenanganan = async () => (await api.get("/api/admin/penanganan")).data.data;
export const adminCreatePenanganan = async (data) => (await api.post("/api/admin/penanganan", data)).data;
export const adminUpdatePenanganan = async (id, data) => (await api.put(`/api/admin/penanganan/${id}`, data)).data;
export const adminDeletePenanganan = async (id) => (await api.delete(`/api/admin/penanganan/${id}`)).data;

// Hasil Deteksi
export const adminGetDeteksi = async () => (await api.get("/api/admin/deteksi")).data.data;
export const adminDeleteDeteksi = async (id) => (await api.delete(`/api/admin/deteksi/${id}`)).data;

export default api;
