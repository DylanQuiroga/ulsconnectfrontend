import "./css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sección 1 */}
        <div className="footer-col">
          <h3 className="footer-title">SOULS</h3>
          <p className="footer-text">Conectando con la comunidad</p>
        </div>

        {/* Sección 2 */}
        <div className="footer-col">
          <h4 className="footer-subtitle">Navegación</h4>
          <ul className="footer-list">
            <li><a href="#">Convocatorias</a></li>
            <li><a href="#">Quiénes somos</a></li>
            <li><a href="#">Noticias</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        {/* Sección 3 */}
        <div className="footer-col">
          <h4 className="footer-subtitle">Legal</h4>
          <ul className="footer-list">
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Política de privacidad</a></li>
          </ul>
        </div>

        {/* Sección 4 */}
        <div className="footer-col">
          <h4 className="footer-subtitle">Síguenos</h4>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" alt="Facebook" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384015.png" alt="Instagram" />
            </a>
            <a href="#" aria-label="TikTok">
              <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Souls. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
