import React from "react";
import "./css/HeroSection.css";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Conecta, ayuda, transforma: Tu viaje de voluntariado comienza aquí</h1>
          <p>Descubre cómo puedes marcar la diferencia en la comunidad junto a Souls y la Universidad de La Serena</p>
          <div className="hero-buttons">
            <button className="btn-green">Ver Convocatorias</button>
            <button className="btn-white">Únete ahora</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
