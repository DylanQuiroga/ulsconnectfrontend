import React, { useState } from "react";
import api from "../lib/api";
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

      // Si todo OK, redirigir a profile (el backend actualmente hace redirect en servidor;
      // aquí forzamos la navegación del cliente)
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
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Correo institucional"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </section>
  );
};

export default LoginSection;
