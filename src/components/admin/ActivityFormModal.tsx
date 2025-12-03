import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./css/ActivityFormModal.css";
import api from "../../services/api";

interface Activity {
    _id?: string;
    titulo: string;
    descripcion: string;
    area: string;
    tipo: string;
    fechaInicio: string;
    fechaTermino?: string;
    fechaFin?: string; // agregado para compatibilidad
    horaInicio?: string;
    horaTermino?: string;
    ubicacion: {
        nombreLugar: string;
        direccion: string;
        nombreComuna: string;
        nombreRegion: string;
        lng?: number; // agregado
    };
    cuposDisponibles?: number;
    imagenUrl?: string;
}

interface ActivityFormModalProps {
    activity: Activity | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ActivityFormModal({ activity, onClose, onSuccess }: ActivityFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Activity>({
        titulo: "",
        descripcion: "",
        area: "Medio Ambiente",
        tipo: "Presencial",
        fechaInicio: "",
        fechaTermino: "",
        horaInicio: "",
        horaTermino: "",
        ubicacion: {
            nombreLugar: "",
            direccion: "",
            nombreComuna: "",
            nombreRegion: "Región de Coquimbo",
        },
        cuposDisponibles: undefined,
        imagenUrl: "",
    });

    useEffect(() => {
        if (activity) {
            setFormData({
                ...activity,
                fechaInicio: activity.fechaInicio ? activity.fechaInicio.split('T')[0] : "",
                fechaTermino: activity.fechaTermino ? activity.fechaTermino.split('T')[0] : "",
            });
        }
    }, [activity]);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("ubicacion.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                ubicacion: {
                    ...prev.ubicacion,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Asegurar nombre de campo 'fechaFin' y ubicacion.lng
            const fechaFinValue = formData.fechaTermino || formData.fechaFin || formData.fechaInicio;
            const ubicacionPayload = {
                ...formData.ubicacion,
                lng: typeof formData.ubicacion.lng === 'number' ? formData.ubicacion.lng : 0
            };

            const payload = {
                ...formData,
                fechaFin: fechaFinValue,
                fechaTermino: undefined, // evitar duplicados si backend no lo espera
                ubicacion: ubicacionPayload,
                capacidad: formData.cuposDisponibles ? Number(formData.cuposDisponibles) : null,
                cuposDisponibles: undefined, // evitar enviar campo incorrecto
            };

            if (activity?._id) {
                // Editar
                const res = await api.put(`/events/${activity._id}`, payload);
                if (res.data.success) {
                    alert("Actividad actualizada correctamente");
                    onSuccess();
                }
            } else {
                // Crear
                const res = await api.post("/events/create", payload);
                if (res.data.success) {
                    alert("Actividad creada correctamente");
                    onSuccess();
                }
            }
        } catch (error: any) {
            console.error("Error al guardar:", error);
            alert("Error al guardar: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content afm-modal">
                <div className="modal-header">
                    <h2>{activity ? "Editar Actividad" : "Nueva Actividad"}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="afm-form">
                    <div className="afm-section">
                        <h3>Información Básica</h3>

                        <div className="afm-field">
                            <label>Título *</label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                placeholder="Ej: Limpieza de Playa Peñuelas"
                            />
                        </div>

                        <div className="afm-field">
                            <label>Descripción *</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Describe la actividad..."
                            />
                        </div>

                        <div className="afm-row">
                            <div className="afm-field">
                                <label>Área *</label>
                                <select name="area" value={formData.area} onChange={handleChange} required>
                                    <option value="Medio Ambiente">Medio Ambiente</option>
                                    <option value="Infantil">Infantil</option>
                                    <option value="Adulto mayor">Adulto mayor</option>
                                </select>
                            </div>

                            <div className="afm-field">
                                <label>Tipo *</label>
                                <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Virtual">Virtual</option>
                                    <option value="Híbrido">Híbrido</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="afm-section">
                        <h3>Fechas y Horarios</h3>

                        <div className="afm-row">
                            <div className="afm-field">
                                <label>Fecha Inicio *</label>
                                <input
                                    type="date"
                                    name="fechaInicio"
                                    value={formData.fechaInicio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="afm-field">
                                <label>Fecha Término</label>
                                <input
                                    type="date"
                                    name="fechaTermino"
                                    value={formData.fechaTermino}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="afm-row">
                            <div className="afm-field">
                                <label>Hora Inicio</label>
                                <input
                                    type="time"
                                    name="horaInicio"
                                    value={formData.horaInicio}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="afm-field">
                                <label>Hora Término</label>
                                <input
                                    type="time"
                                    name="horaTermino"
                                    value={formData.horaTermino}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="afm-section">
                        <h3>Ubicación</h3>

                        <div className="afm-field">
                            <label>Nombre del Lugar *</label>
                            <input
                                type="text"
                                name="ubicacion.nombreLugar"
                                value={formData.ubicacion.nombreLugar}
                                onChange={handleChange}
                                required
                                placeholder="Ej: Playa Peñuelas"
                            />
                        </div>

                        <div className="afm-field">
                            <label>Dirección *</label>
                            <input
                                type="text"
                                name="ubicacion.direccion"
                                value={formData.ubicacion.direccion}
                                onChange={handleChange}
                                required
                                placeholder="Ej: Av. Costanera s/n"
                            />
                        </div>

                        <div className="afm-row">
                            <div className="afm-field">
                                <label>Comuna *</label>
                                <input
                                    type="text"
                                    name="ubicacion.nombreComuna"
                                    value={formData.ubicacion.nombreComuna}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Coquimbo"
                                />
                            </div>

                            <div className="afm-field">
                                <label>Región</label>
                                <input
                                    type="text"
                                    name="ubicacion.nombreRegion"
                                    value={formData.ubicacion.nombreRegion}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="afm-section">
                        <h3>Opcionales</h3>

                        <div className="afm-row">
                            <div className="afm-field">
                                <label>Cupos Disponibles</label>
                                <input
                                    type="number"
                                    name="cuposDisponibles"
                                    value={formData.cuposDisponibles || ""}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="Dejar vacío para ilimitado"
                                />
                            </div>

                            <div className="afm-field">
                                <label>URL de Imagen</label>
                                <input
                                    type="url"
                                    name="imagenUrl"
                                    value={formData.imagenUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="am-btn am-btn-outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="am-btn am-btn-primary" disabled={loading}>
                            {loading ? "Guardando..." : activity ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}