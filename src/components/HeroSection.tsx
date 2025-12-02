import React, { useState, useEffect } from "react";
import "./css/HeroSection.css";
import { Link } from "react-router-dom";
import image1 from "../assets/imagesConvocatorias/image10_a.webp";
import image2 from "../assets/imagesConvocatorias/image15_i.webp";
import image3 from "../assets/imagesConvocatorias/image6_p.webp";

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    image1,
    image2,
    image3
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero-section" aria-label="Sección principal">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-bg ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide})` }}
        />
      ))}

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
            <Link to="/convocatorias_panel">
              <button className="btn-primary" aria-label="Ver convocatorias">
                Ver convocatorias
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-ghost" aria-label="Registrarse">
                Registrarse
              </button>
            </Link>
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

      {/* Indicadores del slider */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
