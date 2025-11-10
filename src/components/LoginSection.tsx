import React from "react";
import "./css/LoginSection.css";

const LoginSection: React.FC = () => {
  return (
    <section className="login-section">
      <div className="login-overlay">
        <div className="login-content">
          <h1 className="login-title">Bienvenido de nuevo</h1>
          <p className="login-subtitle">
            Inicia sesión para continuar ayudando con Souls.
          </p>

          <form className="login-form">
            <input type="email" placeholder="Correo institucional" required />
            <input type="password" placeholder="Contraseña" required />
            <button type="submit" className="btn-green">Iniciar sesión</button>
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
