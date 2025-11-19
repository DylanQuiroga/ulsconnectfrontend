import React from "react";
import "./css/VoluntariosEnAccion.css";
import imagenVoluntario1 from "../assets/imagesConvocatorias/image11_c.webp";
import imagenVoluntario2 from "../assets/imagesConvocatorias/image10_a.webp";
import imagenVoluntario3 from "../assets/imagesConvocatorias/image1_p.webp";
import imagenVoluntario4 from "../assets/imagesConvocatorias/image16_i.webp";

const VoluntariosEnAccion: React.FC = () => {
  const voluntarios = [
    {
      img: imagenVoluntario1,
      titulo: "Ayudando en terreno",
      descripcion: "Nuestros voluntarios apoyan comunidades rurales con actividades educativas y recreativas.",
    },
    {
      img: imagenVoluntario2,
      titulo: "Campañas solidarias",
      descripcion: "Participamos activamente en la recolección de alimentos, ropa y útiles escolares.",
    },
    {
      img: imagenVoluntario3,
      titulo: "Cuidado ambiental",
      descripcion: "Colaboramos en jornadas de limpieza y educación ambiental en toda la región.",
    },
    {
      img: imagenVoluntario4,
      titulo: "Apoyo educativo",
      descripcion: "Nuestros voluntarios enseñan y acompañan a niños y jóvenes en situación vulnerable.",
    },
  ];

  return (
    <section className="voluntarios-section" aria-labelledby="voluntarios-title">
      <div className="voluntarios-inner">
        <h2 id="voluntarios-title" className="voluntarios-title">Nuestros voluntarios en acción</h2>

        <div className="voluntarios-grid" role="list">
          {voluntarios.map((v, i) => (
            <article
              key={i}
              className="voluntario-card"
              role="listitem"
              aria-labelledby={`v-title-${i}`}
              tabIndex={0}
            >
              <div className="voluntario-media">
                <img
                  src={v.img}
                  alt={v.titulo}
                  loading="lazy"
                  className="voluntario-img"
                />
                <div className="voluntario-badge">{i === 0 ? "Destacado" : "Voluntariado"}</div>
              </div>

              <div className="voluntario-body">
                <div>
                  <h3 id={`v-title-${i}`} className="voluntario-titulo">{v.titulo}</h3>
                  <p className="voluntario-descripcion">{v.descripcion}</p>
                </div>
              </div>

              <div className="voluntario-footer">
                <button
                  className="voluntario-cta"
                  onClick={() => console.log("Ver detalle:", v.titulo)}
                  aria-label={`Ver más sobre ${v.titulo}`}
                >
                  Ver más
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VoluntariosEnAccion;