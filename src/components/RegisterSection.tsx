import React from "react";
import "./css/RegisterSection.css";

const RegisterSection: React.FC = () => {
  return (
    <section className="register-section">
      <div className="register-overlay">
        <div className="register-content">
          <h1 className="register-title">Únete a Souls</h1>
          <p className="register-subtitle">
            Crea tu cuenta y comienza tu viaje de voluntariado con la Universidad de La Serena
          </p>

          <form className="register-form">
            <input type="text" placeholder="Nombre completo" required />
            <input type="email" placeholder="Correo institucional" required />
            <input type="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar contraseña" required />
            <button type="submit" className="btn-green">Registrarme</button>
          </form>

          <p className="register-login">
            ¿Ya tienes cuenta? <a href="#">Inicia sesión</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
