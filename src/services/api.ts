import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true, // importante para enviar/recibir cookies de sesión
});

export default api;