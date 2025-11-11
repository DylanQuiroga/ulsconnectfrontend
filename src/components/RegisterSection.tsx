import React, {useState} from "react";
import "./css/RegisterSection.css";

const RegisterSection: React.FC = () => {
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const age = formData.get("age");
    
    // Validar que la edad no sea negativa
    if (age && parseInt(age as string) < 0) {
      setError("La edad no puede ser negativa");
      return;
    }

    // Validar que la edad esté en un rango razonable
    if (age && (parseInt(age as string) < 0 || parseInt(age as string) > 100)) {
      setError("Por favor ingresa una edad válida (0-100 años)");
      return;
    }

    // Validar correo userena.cl
    if (!email.endsWith('@userena.cl')) {
      setError("Por favor ingresa un correo institucional válido (@userena.cl)");
      return;
    }

    // Si pasa todas las validaciones, procesar el formulario
    console.log("Formulario válido, procesando...");
    // Aquí iría tu lógica para enviar los datos al servidor
  };


  return (
    <section className="register-section">
      <div className="register-overlay">
        <div className="register-content">
          <h1 className="register-title">Únete a Souls</h1>
          <p className="register-subtitle">
            Crea tu cuenta y comienza tu viaje de voluntariado con Souls.
          </p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-grid">
              <div className="register-field">
                <label htmlFor="fullName">Nombre completo</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Ingresa tu nombre y apellido"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="age">Edad</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Ingresa tu edad"
                  min="0"
                  max="100"
                  step="1"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="phone">Teléfono de contacto</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="register-field">
                <label htmlFor="email">Correo institucional</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  pattern="[a-zA-Z0-9._%+-]+@userena\.cl"
                  placeholder="nombre@userena.cl"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="career">Carrera</label>
                <select id="career" name="career" defaultValue="">
                  <option value="" disabled>
                    Selecciona tu carrera
                  </option>
                  <option value="administracion_publica">
                    Administración Pública
                  </option>
                  <option value="arquitectura">Arquitectura</option>
                  <option value="auditoria">Auditoría</option>
                  <option value="derecho">Derecho</option>
                  <option value="diseño">Diseño</option>
                  <option value="enfermeria">Enfermería</option>
                  <option value="ingenieria_administracion_empresas">
                    Ingeniería en Administración de Empresas
                  </option>
                  <option value="ingenieria_biotecnologia_mencion_alimentos_procesos_sustentables">
                    Ingeniería en Biotecnología con mención Alimentos o Procesos
                    Sustentables
                  </option>
                  <option value="ingenieria_civil">Ingeniería Civil</option>
                  <option value="ingenieria_civil_ambiental">
                    Ingeniería Civil Ambiental
                  </option>
                  <option value="ingenieria_civil_computacion_informatica">
                    Ingeniería Civil en Computación e Informática
                  </option>
                  <option value="ingenieria_civil_industrial">
                    Ingeniería Civil Industrial
                  </option>
                  <option value="ingenieria_civil_mecanica">
                    Ingeniería Civil Mecánica
                  </option>
                  <option value="ingenieria_civil_minas">
                    Ingeniería Civil de Minas
                  </option>
                  <option value="ingenieria_comercial">
                    Ingeniería Comercial
                  </option>
                  <option value="ingenieria_computacion">
                    Ingeniería en Computación 💀
                  </option>
                  <option value="ingenieria_construcción">
                    Ingeniería en Construcción
                  </option>
                  <option value="ingenieria_mecanica">
                    Ingeniería Mecánica
                  </option>
                  <option value="ingenieria_minas">Ingeniería de Minas</option>
                  <option value="kinesiologia">Kinesiología</option>
                  <option value="licenciatura_astronomia">
                    Licenciatura en Astronomía
                  </option>
                  <option value="licenciatura_musica">
                    Licenciatura en Música
                  </option>
                  <option value="medicina">Medicina</option>
                  <option value="odontologia">Odontología</option>
                  <option value="pedagogia_biologia_ciencias_naturales">
                    Pedagogía en Biología y Ciencias Naturales
                  </option>
                  <option value="pedagogia_castellano_filosofia">
                    Pedagogía en Castellano y Filosofía
                  </option>
                  <option value="pedagogia_educacion_diferencial">
                    Pedagogía en Educación Diferencial
                  </option>
                  <option value="pedagogia_educacion_general_basica_laserena">
                    Pedagogía en Educación General Básica (La Serena)
                  </option>
                  <option value="pedagogia_educacion_general_basica_ovalle">
                    Pedagogía en Educación General Básica (Ovalle)
                  </option>
                  <option value="pedagogia_educacion_musical">
                    Pedagogía en Educación Musical
                  </option>
                  <option value="pedagogia_educacion_parvularia">
                    Pedagogía en Educación Parvularia
                  </option>
                  <option value="pedagogia_historia_geografia">
                    Pedagogía en Historia y Geografía
                  </option>
                  <option value="pedagogia_ingles">Pedagogía en Inglés</option>
                  <option value="pedagogia_matematicas">
                    Pedagogía en Matemáticas
                  </option>
                  <option value="pedagogia_matematias_fisica">
                    Pedagogía en Matemáticas y Física
                  </option>
                  <option value="periodismo">Periodismo</option>
                  <option value="psicologia">Psicología</option>
                  <option value="quimica">Química</option>
                  <option value="quimica_y_farmacia">Química y Farmacia</option>
                  <option value="traduccion_ingles_español">
                    Traducción Inglés-Español
                  </option>
                </select>
              </div>

              <div className="register-field">
                <label htmlFor="commune">Comuna de residencia</label>
                <select id="commune" name="commune" defaultValue="">
                  <option value="" disabled>
                    Selecciona tu comuna
                  </option>
                  <option value="andacollo">Andacollo</option>
                  <option value="canela">Canela</option>
                  <option value="combarbala">Combarbalá</option>
                  <option value="coquimbo">Coquimbo</option>
                  <option value="illapel">Illapel</option>
                  <option value="la_higuera">La Higuera</option>
                  <option value="la_serena">La Serena</option>
                  <option value="los_vilos">Los Vilos</option>
                  <option value="monte_patria">Monte Patria</option>
                  <option value="ovalle">Ovalle</option>
                  <option value="rio_hurtado">Río Hurtado</option>
                  <option value="punitaqui">Punitaqui</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>

            <fieldset
              className="register-causes"
              style={{ border: "none", padding: 0, marginTop: 8 }}
            >
              <legend style={{ fontSize: "0.95rem", marginBottom: 8 }}>
                ¿Qué causas te interesan?
              </legend>
              <div
                className="causes-list"
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input type="checkbox" name="causes" value="infantes" />{" "}
                  Infantes
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    name="causes"
                    value="adultos-mayores"
                  />{" "}
                  Adultos Mayores
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input type="checkbox" name="causes" value="medio-ambiente" />{" "}
                  Medio Ambiente
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              className="register__btn"
              style={{ marginTop: 18 }}
            >
              Enviar registro
            </button>
          </form>

          <p className="register-login">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
