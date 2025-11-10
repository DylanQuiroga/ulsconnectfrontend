import React from "react";
import "./css/RegisterSection.css";

const RegisterSection: React.FC = () => {
  return (
    <section className="register-section">
      <div className="register-overlay">
        <div className="register-content">
          <h1 className="register-title">Únete a Souls</h1>
          <p className="register-subtitle">
            Crea tu cuenta y comienza tu viaje de voluntariado con Souls.
          </p>

          <form className="register-form">
            <div className="register-grid">
              <div className="register-field">
                <label htmlFor="fullName">Nombre completo</label>
                <input id="fullName" name="fullName" type="text" placeholder="Ingresa tu nombre y apellido" required />
              </div>

              <div className="register-field">
                <label htmlFor="age">Edad</label>
                <input id="age" name="age" type="number" placeholder="Ingresa tu edad" required />
              </div>

              <div className="register-field">
                <label htmlFor="phone">Teléfono de contacto</label>
                <input id="phone" name="phone" type="tel" placeholder="+56 9 1234 5678" />
              </div>

              <div className="register-field">
                <label htmlFor="email">Correo institucional</label>
                <input id="email" name="email" type="email" placeholder="nombre@institucion.com" required />
              </div>

              <div className="register-field">
                <label htmlFor="career">Carrera o Área de estudio</label>
                <select id="career" name="career" defaultValue="">
                  <option value="" disabled>Selecciona tu carrera</option>
                  <option value="socialWork">Trabajo social</option>
                  <option value="education">Educación</option>
                  <option value="environment">Medio ambiente</option>
                </select>
              </div>

              <div className="register-field">
                <label htmlFor="commune">Comuna de residencia</label>
                <select id="commune" name="commune" defaultValue="">
                  <option value="" disabled>Selecciona tu comuna</option>
                  <option value="santiago">Santiago</option>
                  <option value="providencia">Providencia</option>
                  <option value="ñuñoa">Ñuñoa</option>
                </select>
              </div>
            </div>

            <fieldset className="register-causes" style={{ border: "none", padding: 0, marginTop: 8 }}>
              <legend style={{ fontSize: "0.95rem", marginBottom: 8 }}>¿Qué causas te interesan?</legend>
              <div className="causes-list" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" name="causes" value="infantes" /> Infantes
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" name="causes" value="adultos-mayores" /> Adultos Mayores
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" name="causes" value="medio-ambiente" /> Medio Ambiente
                </label>
              </div>
            </fieldset>

            <button type="submit" className="register__btn" style={{ marginTop: 18 }}>
              Enviar registro
            </button>
          </form>

          <p className="register-login">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
