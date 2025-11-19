import "./css/SobreSouls.css";
import imagen from "../assets/imagesConvocatorias/image15_i.webp"

export default function SobreSouls() {
  return (
    <section className="sobre-section">
      <div className="sobre-container">
        <div className="sobre-img-container">
          <img
            src={imagen}
            alt="Voluntariado Souls"
            className="sobre-img"
          />
        </div>
        <div className="sobre-texto">
          <h2 className="sobre-titulo">¿Qué es SOULS?</h2>
          <p className="sobre-descripcion">
            SOULS es una iniciativa dedicada a conectar a personas comprometidas con el cambio
            social. A través de distintos programas de voluntariado, trabajamos junto a la
            Universidad de La Serena para generar un impacto positivo en la comunidad, fomentando
            la empatía, la cooperación y el desarrollo sostenible.
          </p>
          <p className="sobre-descripcion">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at lorem a magna
            vestibulum tincidunt. Nullam eget justo vel nibh placerat convallis. Integer
            consectetur, lorem in feugiat dignissim, justo lacus interdum lacus, id finibus eros
            enim ac elit.
          </p>
        </div>
      </div>
    </section>
  );
}
