import "./css/ConvocatoriasDestacadas.css";

const convocatorias = [
  {
    imagen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    categoria: "Infancia",
    titulo: "Apoyo escolar en comunidades rurales",
    descripcion: "Únete a nuestro programa de voluntariado para brindar refuerzo escolar a niños y niñas que más lo necesitan.",
  },
  {
    imagen: "https://images.unsplash.com/photo-1584467735815-f778f274e27c",
    categoria: "Adulto Mayor",
    titulo: "Compañía y recreación para adultos mayores",
    descripcion: "Participa en actividades recreativas y de acompañamiento para mejorar la calidad de vida de personas mayores.",
  },
  {
    imagen: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    categoria: "Medioambiente",
    titulo: "Reforestación y cuidado del entorno",
    descripcion: "Ayúdanos a plantar árboles y limpiar espacios naturales en distintas zonas del país.",
  },
];

export default function ConvocatoriasDestacadas() {
  return (
    <section className="convocatorias-section">
      <h2 className="convocatorias-title">Convocatorias destacadas</h2>
      <div className="convocatorias-grid">
        {convocatorias.map((item, index) => (
          <div className="convocatoria-card" key={index}>
            <img src={item.imagen} alt={item.titulo} className="convocatoria-img" />
            <p className="convocatoria-categoria">{item.categoria}</p>
            <h3 className="convocatoria-titulo">{item.titulo}</h3>
            <p className="convocatoria-descripcion">{item.descripcion}</p>
            <button className="btn-saber-mas">Saber más</button>
          </div>
        ))}
      </div>
    </section>
  );
}
