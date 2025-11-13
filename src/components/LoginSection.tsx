import React, { useState } from "react";
import api from "../services/api";
import "./css/LoginSection.css";

const LoginSection: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/login", {
        correoUniversitario: correo,
        contrasena,
      });

      // Si todo OK, redirigir a profile
      if (res.status >= 200 && res.status < 300) {
        window.location.href = "/profile";
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error de autenticación");
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
