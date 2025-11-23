import React, { useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../stores/sessionStore";
import { useNavigate } from "react-router-dom";
import "./css/LoginSection.css";

const LoginSection: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ CORREGIDO: El endpoint es /login (sin /auth)
      const res = await api.post("/login", {
        correoUniversitario: correo,
        contrasena: contrasena,
      });

      if (res.data.success) {
        const userData = res.data.user;

        // ✅ Guardar usuario completo con todos los campos
        setUser({
          id: userData._id || userData.id,
          nombre: userData.nombre,
          correoUniversitario: userData.correoUniversitario,
          telefono: userData.telefono,
          intereses: userData.intereses,
          role: userData.rol || userData.role, // El backend usa 'rol'
          edad: userData.edad,
          carrera: userData.carrera,
          comuna: userData.comuna,
          direccion: userData.direccion,
        });

        // ✅ Redirigir según el rol
        const userRole = userData.rol || userData.role;
        if (userRole === "admin" || userRole === "staff") {
          navigate("/admin/dashboard");
        } else {
          navigate("/volunteer/panel");
        }
      }
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-overlay">
        <div className="login-content">
          <h1 className="login-title">Bienvenido de nuevo</h1>
          <p className="login-subtitle">
            Inicia sesión para continuar ayudando con Souls.
          </p>

          {error && <p className="login-error">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo institucional"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="login__btn" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="login-register">
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
