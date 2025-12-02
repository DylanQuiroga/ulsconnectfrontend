import React, { useState } from "react";
import { FaEnvelope, FaUser, FaTag, FaCommentAlt, FaPaperPlane, FaMapMarkerAlt, FaPhone, FaInstagram, FaFacebook } from "react-icons/fa";
import "../components/css/contacto.css";
import loadingGif from "../public/loading.gif";

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Información de contacto */}
        <div className="contact-info">
          <h2 className="contact-info-title">¿Tienes alguna pregunta?</h2>
          <p className="contact-info-subtitle">
            Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <strong>Dirección</strong>
                <p>Universidad de La Serena, La Serena, Chile</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <FaEnvelope />
              </div>
              <div>
                <strong>Correo</strong>
                <p>souls@userena.cl</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <FaPhone />
              </div>
              <div>
                <strong>Teléfono</strong>
                <p>+56 51 2 204000</p>
              </div>
            </div>
          </div>

          <div className="contact-social">
            <span>Síguenos:</span>
            <div className="contact-social-icons">
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="contact-form">
          <h2 className="contact-form-title">Envíanos un mensaje</h2>

          <form
            id="contact-form"
            action="https://formsubmit.co/mariokiller951@gmail.com"
            method="POST"
            onSubmit={() => setLoading(true)}
          >
            <div className="form-group">
              <div className="input-icon">
                <FaUser />
              </div>
              <input type="text" name="name" placeholder="Tu nombre" required />
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input type="email" name="email" placeholder="Tu correo electrónico" required />
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FaTag />
              </div>
              <input type="text" name="subject" placeholder="Asunto" required />
            </div>

            <div className="form-group">
              <div className="input-icon textarea-icon">
                <FaCommentAlt />
              </div>
              <textarea
                name="comments"
                placeholder="Escribe tu mensaje aquí..."
                rows={5}
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <img src={loadingGif} alt="Cargando..." width="20" />
                  Enviando...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Enviar mensaje
                </>
              )}
            </button>

            {/* Redirección luego de enviar */}
            <input type="hidden" name="_next" value="https://ulsconnect.dylan.click/success" />

            {/* Desactivar captcha */}
            <input type="hidden" name="_captcha" value="false" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
