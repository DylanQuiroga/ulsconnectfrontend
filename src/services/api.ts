import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Función mejorada para extraer el token CSRF
function getCsrfToken(): string | null {
    const possibleNames = ['XSRF-TOKEN', '_csrf', 'csrf-token', 'csrfToken'];
    const decodedCookie = decodeURIComponent(document.cookie);

    console.log('🍪 Cookies disponibles:', document.cookie);

    for (const name of possibleNames) {
        const cookieValue = decodedCookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`));

        if (cookieValue) {
            const token = cookieValue.split('=')[1];
            console.log(`🔐 Token CSRF encontrado en cookie '${name}':`, token.substring(0, 10) + "...");
            return token;
        }
    }

    console.warn("⚠️ No se encontró token CSRF en las cookies");
    return null;
}

api.interceptors.request.use(
    (config) => {
        console.log("🔄 Request:", config.method?.toUpperCase(), config.url);

        // Agregar token CSRF a todos los POST, PUT, DELETE, PATCH
        if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
            const csrfToken = getCsrfToken();
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
                console.log("🔐 CSRF Token agregado al header");
            } else {
                console.warn("⚠️ No se encontró token CSRF en las cookies");
            }
        }

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

export const userManagementAPI = {
    getPendingRequests: () => api.get('/auth/registration/requests'),
    approveUser: (id: string) => api.post(`/auth/registration/requests/${id}/approve`),
    rejectUser: (id: string, notes?: string) => api.post(`/auth/registration/requests/${id}/reject`, { notes })
};

export default api;