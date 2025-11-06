import React from "react";
import "./css/VoluntariosEnAccion.css";

const VoluntariosEnAccion: React.FC = () => {
  const voluntarios = [
    {
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
      titulo: "Ayudando en terreno",
      descripcion: "Nuestros voluntarios apoyan comunidades rurales con actividades educativas y recreativas.",
    },
    {
      img: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&w=800&q=80",
      titulo: "Campañas solidarias",
      descripcion: "Participamos activamente en la recolección de alimentos, ropa y útiles escolares.",
    },
    {
      img: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=800&q=80",
      titulo: "Cuidado ambiental",
      descripcion: "Colaboramos en jornadas de limpieza y educación ambiental en toda la región.",
    },
    {
      img: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      titulo: "Apoyo educativo",
      descripcion: "Nuestros voluntarios enseñan y acompañan a niños y jóvenes en situación vulnerable.",
    },
  ];

  return (
    <section className="voluntarios-section">
      <h2 className="voluntarios-title">Nuestros voluntarios en acción</h2>
      <div className="voluntarios-grid">
        {voluntarios.map((v, i) => (
          <div key={i} className="voluntario-card">
            <img src={v.img} alt={v.titulo} className="voluntario-img" />
            <h3 className="voluntario-titulo">{v.titulo}</h3>
            <p className="voluntario-descripcion">{v.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VoluntariosEnAccion;
