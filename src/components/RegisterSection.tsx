import React, {useState} from "react";
import axios from "axios";
import "./css/RegisterSection.css";

// Importar los datos desde los archivos JSON
import careersData from "../data/careers.json";
import communesData from "../data/communes.json";

// Interfaz para los datos del formulario
interface FormData {
  fullName: string;
  age: string;
  phone: string;
  email: string;
  career: string;
  commune: string;
  causes: string[];
}

const RegisterSection: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const age = formData.get("age") as string;

    // Validaciones
    if (age && parseInt(age) < 0) {
      setError("La edad no puede ser negativa");
      setLoading(false);
      return;
    }

    if (age && (parseInt(age) < 0 || parseInt(age) > 100)) {
      setError("Por favor ingresa una edad válida (0-100 años)");
      setLoading(false);
      return;
    }

    if (!email.endsWith('@userena.cl')) {
      setError("Por favor ingresa un correo institucional válido (@userena.cl)");
      setLoading(false);
      return;
    }

    // Preparar datos para enviar
    const causes = formData.getAll("causes") as string[];
    
    const submitData: FormData = {
      fullName: formData.get("fullName") as string,
      age: age,
      phone: formData.get("phone") as string,
      email: email,
      career: formData.get("career") as string,
      commune: formData.get("commune") as string,
      causes: causes
    };

    try {
      // Simular petición al backend con Axios
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 segundos timeout
      });

      // Simular un delay para ver mejor el loading (opcional)
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Respuesta del servidor:", response.data);
      setSuccess(true);
      
      // Opcional: Resetear el formulario
      (e.target as HTMLFormElement).reset();

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          setError(`Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Intenta nuevamente'}`);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
        } else {
          // Algo pasó en la configuración de la petición
          setError("Error al configurar la petición: " + error.message);
        }
      } else {
        setError("Error inesperado: " + (error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-section">
      <div className="register-overlay">
        <div className="register-content">
          <h1 className="register-title">Únete a Souls</h1>
          <p className="register-subtitle">
            Crea tu cuenta y comienza tu viaje de voluntariado con Souls.
          </p>

          {/* Mensaje de éxito */}
          {success && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              border: '1px solid #c3e6cb'
            }}>
              ¡Registro exitoso! Te contactaremos pronto.
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}

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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="register-field">
                <label htmlFor="phone">Teléfono de contacto</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  disabled={loading}
                />
              </div>

              <div className="register-field">
                <label htmlFor="email">Correo institucional</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  pattern="[a-zA-Z0-9._%+\-]+@userena\.cl"
                  placeholder="nombre@userena.cl"
                  required
                  disabled={loading}
                />
              </div>

              <div className="register-field">
                <label htmlFor="career">Carrera</label>
                <select 
                  id="career" 
                  name="career" 
                  defaultValue=""
                  disabled={loading}
                >
                  <option value="" disabled>
                    Selecciona tu carrera
                  </option>
                  {careersData.careers.map((career) => (
                    <option key={career.value} value={career.value}>
                      {career.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="register-field">
                <label htmlFor="commune">Comuna de residencia</label>
                <select 
                  id="commune" 
                  name="commune" 
                  defaultValue=""
                  disabled={loading}
                >
                  <option value="" disabled>
                    Selecciona tu comuna
                  </option>
                  {communesData.communes.map((commune) => (
                    <option key={commune.value} value={commune.value}>
                      {commune.label}
                    </option>
                  ))}
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
                  <input 
                    type="checkbox" 
                    name="causes" 
                    value="infantes" 
                    disabled={loading}
                  />{" "}
                  Infantes
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    name="causes"
                    value="adultos-mayores"
                    disabled={loading}
                  />{" "}
                  Adultos Mayores
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input 
                    type="checkbox" 
                    name="causes" 
                    value="medio-ambiente" 
                    disabled={loading}
                  />{" "}
                  Medio Ambiente
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              className="register__btn"
              style={{ marginTop: 18 }}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar registro"}
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