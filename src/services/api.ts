import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true, // ✅ CRÍTICO: Enviar cookies con cada petición
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        console.log("🔄 Request:", config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log("✅ Response:", response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error("❌ Error:", error.config?.url, error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;