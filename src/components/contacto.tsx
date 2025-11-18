import React, { useState } from "react";
import "../components/css/contacto.css";
import loadingGif from "../public/loading.gif";

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="contact-section">
      {/* Formulario */}
      <div className="contact-form">
        <h2>Contacto</h2>

        <form
          id="contact-form"
          action="https://formsubmit.co/mariokiller951@gmail.com"
          method="POST"
          onSubmit={() => setLoading(true)}
        >
          <input type="text" name="name" placeholder="Nombre" required />
          <input type="email" name="email" placeholder="Correo electrónico" required />
          <input type="text" name="subject" placeholder="Asunto" required />

          <textarea
            name="comments"
            placeholder="Mensaje"
            rows={5}
            required
            className="custom-textarea"
          ></textarea>

          <button type="submit" id="submit-button">
            Enviar
          </button>

          {loading && (
            <span id="loading-gif" style={{ marginLeft: "20px" }}>
              <img src={loadingGif} alt="Cargando..." width="30" />
            </span>
          )}

          {/* Redirección luego de enviar */}
          <input type="hidden" name="_next" value="https://ulsconnect.dylan.click/success" />

          {/* Desactivar captcha */}
          <input type="hidden" name="_captcha" value="false" />
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
