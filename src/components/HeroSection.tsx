import React from "react";
import "./css/HeroSection.css";
import { Link, useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="hero-section" aria-label="Sección principal">
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-left">
          <span className="hero-kicker">Voluntariado Estudiantil</span>

          <h1 className="hero-title">
            Conecta con oportunidades de voluntariado que transforman tu comunidad
          </h1>

          <p className="hero-subtitle">
            Encuentra convocatorias, proyectos y eventos en la Universidad de La Serena.
            Participar es fácil — inscríbete y aporta con tus habilidades.
          </p>

          <div className="hero-buttons">
            <Link to="/convocatorias_panel"><button
              className="btn-primary"
              onClick={() => {
                /* navegar a convocatorias */
              }}
              aria-label="Ver convocatorias"
            >
              Ver convocatorias
            </button></Link>
            <Link to="/register"><button
              className="btn-ghost"
              aria-label="Registrarse"
            >
              Registrarse
            </button></Link>
          </div>
        </div>

        <aside className="hero-right" aria-label="Información destacada">
          <div className="card">
            <div className="card-header">
              <strong>Participa hoy</strong>
              <span className="card-sub">Próximas convocatorias</span>
            </div>

            <ul className="card-list" aria-hidden="false">
              <li>
                <strong>Campaña Ambiental</strong>
                <span> — 12 mayo</span>
              </li>
              <li>
                <strong>Apoyo Escolar</strong>
                <span> — 18 mayo</span>
              </li>
              <li>
                <strong>Jornada Salud</strong>
                <span> — 25 mayo</span>
              </li>
            </ul>

            <div className="card-actions">
              <Link to="/convocatorias_panel"><button className="card-btn">Ver todas</button></Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default HeroSection;
