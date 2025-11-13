import React, { useState } from "react";
import api from "../services/api";
import "./css/RegisterSection.css";
import axios from "axios";

// Importar los datos desde los archivos JSON
import careersData from "../data/careers.json";
import communesData from "../data/communes.json";

// Interfaz para los datos del formulario
interface FormData {
  nombreCompleto: string;
  edad: string;
  telefono: string;
  contrasena: string;
  email: string;
  carrera: string;
  comuna: string;
  direccion: string; // <-- añadido
  causas: string[];
  status: string;

}

const RegisterSection: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // nuevos estados para contraseña
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const edad = formData.get("edad") as string;

    // Validaciones
    if (edad && parseInt(edad) < 0) {
      setError("La edad no puede ser negativa");
      setLoading(false);
      return;
    }

    if (edad && (parseInt(edad) < 0 || parseInt(edad) > 100)) {
      setError("Por favor ingresa una edad válida (0-100 años)");
      setLoading(false);
      return;
    }

    if (!email.endsWith('@userena.cl')) {
      setError("Por favor ingresa un correo institucional válido (@userena.cl)");
      setLoading(false);
      return;
    }

    // validar contraseñas
    if (!password || !confirmPassword) {
      setError("Ingresa y confirma la contraseña.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    // Preparar datos para enviar (manteniendo los campos del formulario)
    const causas = formData.getAll("causes") as string[];

    const submitData: FormData = {
      nombreCompleto: formData.get("fullName") as string,
      edad: edad,
      telefono: formData.get("phone") as string,
      email: email,
      carrera: formData.get("career") as string,
      comuna: formData.get("commune") as string,
      direccion: formData.get("direccion") as string, // <-- añadido
      causas: causas,
      contrasena: password,
      status: "pendiente"
    };

    try {
      const payload = {
        nombre: submitData.nombreCompleto,
        correoUniversitario: submitData.email,
        contrasena: submitData.contrasena,
        status: "pendiente",
        rol: "estudiante",
        edad: submitData.edad,
        telefono: submitData.telefono,
        carrera: submitData.carrera,
        comuna: submitData.comuna,
        direccion: submitData.direccion, // <-- añadido
        intereses: submitData.causas
      };

      const response = await api.post("/signup", payload);

      // Si backend hace redirect a /profile, forzar navegación; si devuelve OK, también
      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setPassword("");
        setConfirmPassword("");
      } else {
        setError("No se pudo registrar. Intenta nuevamente.");
      }

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(`Error del servidor: ${error.response.status} - ${error.response.data?.error || error.response.data?.message || 'Intenta nuevamente'}`);
        } else if (error.request) {
          setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
        } else {
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
                <label htmlFor="edad">Edad</label>
                <input
                  id="edad"
                  name="edad"
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

              {/* campo de dirección */}
              <div className="register-field">
                <label htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  placeholder="Calle, número, depto/casa"
                  disabled={loading}
                />
              </div>

              {/* campos de contraseña */}
              <div className="register-field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Crea una contraseña (mín. 8 caracteres)"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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