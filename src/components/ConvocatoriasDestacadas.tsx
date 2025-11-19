import "./css/ConvocatoriasDestacadas.css";
import imagenInfancia from "../assets/imagesConvocatorias/image2_i.webp"
import imagenAdulto from "../assets/imagesConvocatorias/image9_a.webp"
import imagenMedioambiente from "../assets/imagesConvocatorias/image5_p.webp"

const convocatorias = [
  {
    imagen: imagenInfancia,
    categoria: "Infancia",
    titulo: "Apoyo escolar en comunidades rurales",
    descripcion:
      "Únete a nuestro programa para brindar refuerzo escolar a niños y niñas que más lo necesitan.",
  },
  {
    imagen: imagenAdulto,
    categoria: "Adulto Mayor",
    titulo: "Compañía y recreación para adultos mayores",
    descripcion:
      "Participa en actividades recreativas y de acompañamiento para mejorar su calidad de vida.",
  },
  {
    imagen: imagenMedioambiente,
    categoria: "Medioambiente",
    titulo: "Reforestación y cuidado del entorno",
    descripcion:
      "Ayúdanos a plantar árboles y limpiar espacios naturales en distintas zonas del país.",
  }
];

export default function ConvocatoriasDestacadas() {
  return (
    <section className="convocatorias-section" aria-labelledby="convocatorias-title">
      <div className="convocatorias-inner">
        <h2 id="convocatorias-title" className="convocatorias-title">
          Convocatorias destacadas
        </h2>
        <p className="convocatorias-intro">
          Actividades seleccionadas que requieren voluntariado urgente. Inscríbete y forma parte del cambio.
        </p>

        <div className="convocatorias-grid" role="list">
          {convocatorias.map((item, index) => (
            <article
              key={index}
              className="conv-card"
              role="listitem"
              aria-labelledby={`conv-${index}-title`}
              tabIndex={0}
            >
              <div className="conv-media">
                <img
                  src={`${item.imagen}?auto=format&fit=crop&w=1400&q=70`}
                  alt={item.titulo}
                  className="conv-img"
                  loading="lazy"
                />
                <div className="conv-overlay" aria-hidden="true" />
                <div className="conv-caption">
                  <span className="conv-category">{item.categoria}</span>
                  <h3 id={`conv-${index}-title`} className="conv-card-title">{item.titulo}</h3>
                </div>
              </div>

              <div className="conv-body">
                <p className="conv-description">{item.descripcion}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="conv-footer">
          <button className="conv-vermas" aria-label="Ver más convocatorias">VER MÁS</button>
        </div>
      </div>
    </section>
  );
}