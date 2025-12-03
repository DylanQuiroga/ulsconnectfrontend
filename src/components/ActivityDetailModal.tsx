import React, { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaInfoCircle, FaCheckCircle, FaTag, FaBuilding } from "react-icons/fa";
import "./css/ActivityDetailModal.css";
import api from "../services/api";
import { useAuthStore } from "../stores/sessionStore";

interface Activity {
    _id: string;
    titulo: string;
    descripcion: string;
    area: string;
    tipo: string;
    fechaInicio: string;
    fechaTermino?: string;
    fechaFin?: string;
    horaInicio?: string;
    horaTermino?: string;
    ubicacion: {
        nombreLugar: string;
        direccion?: string;
        nombreComuna: string;
        nombreRegion?: string;
    };
    cuposDisponibles?: number;
    capacidad?: number;
    estado: string;
    imagenUrl?: string;
    requisitos?: string[];
    contacto?: {
        nombre?: string;
        email?: string;
        telefono?: string;
    };
    enrolled?: boolean;
    isClosed?: boolean;
}

interface ActivityDetailModalProps {
    activity: Activity;
    onClose: () => void;
    onEnrollSuccess?: (activityId: string) => void;
}

export default function ActivityDetailModal({ activity, onClose, onEnrollSuccess }: ActivityDetailModalProps) {
    const { user } = useAuthStore();
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(activity.enrolled || false);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "Por definir";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-CL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        // No mostrar si es medianoche (probablemente no se asignó hora)
        if (hours === '00' && minutes === '00') return "";
        return `${hours}:${minutes}`;
    };

    // Obtener fechaFin (puede venir como fechaFin o fechaTermino)
    const fechaFin = (activity as any).fechaFin || activity.fechaTermino;

    // Obtener cupos (puede venir como capacidad o cuposDisponibles)
    const cupos = (activity as any).capacidad || activity.cuposDisponibles;

    const handleEnroll = async () => {
        if (!user) {
            alert("Debes iniciar sesión para inscribirte");
            return;
        }

        setEnrolling(true);
        try {
            // Antes: POST /events/:id/enroll -> 404
            // Usar endpoint backend existente para crear inscripción
            const res = await api.post(`/inscripciones/${activity._id}`);

            if (res.data.success) {
                setIsEnrolled(true);
                if (onEnrollSuccess) {
                    onEnrollSuccess(activity._id);
                }
                alert("¡Inscripción exitosa! Te hemos enviado un correo de confirmación.");
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Error al inscribirse";

            if (errorMsg.includes("Ya estás inscrito")) {
                setIsEnrolled(true);
                if (onEnrollSuccess) {
                    onEnrollSuccess(activity._id);
                }
                alert("Ya estás inscrito en esta actividad.");
            } else if (errorMsg.includes("convocatoria está cerrada")) {
                alert(`Esta convocatoria está cerrada. ${err.response?.data?.motivo || ""}`);
            } else {
                alert(`Error: ${errorMsg}`);
            }
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content adm-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header con imagen */}
                <div className="adm-header">
                    {activity.imagenUrl && (
                        <div
                            className="adm-header-image"
                            style={{ backgroundImage: `url(${activity.imagenUrl})` }}
                        />
                    )}
                    <button className="modal-close adm-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                    <div className="adm-header-content">
                        <div className="adm-badges">
                            <span className={`adm-badge adm-badge-${activity.area.toLowerCase().replace(" ", "-")}`}>
                                {activity.area}
                            </span>
                            <span className="adm-badge adm-badge-type">{activity.tipo}</span>
                            {isEnrolled && (
                                <span className="adm-badge adm-badge-enrolled">
                                    <FaCheckCircle /> Inscrito
                                </span>
                            )}
                            {activity.isClosed && (
                                <span className="adm-badge adm-badge-closed">Cerrada</span>
                            )}
                        </div>
                        <h2 className="adm-title">{activity.titulo}</h2>
                    </div>
                </div>

                {/* Body */}
                <div className="adm-body">
                    {/* Descripción */}
                    <section className="adm-section">
                        <div className="adm-section-header">
                            <FaInfoCircle />
                            <h3>Descripción</h3>
                        </div>
                        <p className="adm-description">{activity.descripcion}</p>
                    </section>

                    {/* Información de fecha y hora */}
                    <section className="adm-section">
                        <div className="adm-section-header">
                            <FaCalendarAlt />
                            <h3>Fecha y Horario</h3>
                        </div>
                        <div className="adm-info-grid">
                            <div className="adm-info-item">
                                <span className="adm-info-label">Fecha de inicio:</span>
                                <span className="adm-info-value">{formatDate(activity.fechaInicio)}</span>
                                {formatTime(activity.fechaInicio) && (
                                    <span className="adm-info-time">
                                        <FaClock /> {formatTime(activity.fechaInicio)} hrs
                                    </span>
                                )}
                            </div>
                            {fechaFin && (
                                <div className="adm-info-item">
                                    <span className="adm-info-label">Fecha de término:</span>
                                    <span className="adm-info-value">{formatDate(fechaFin)}</span>
                                    {formatTime(fechaFin) && (
                                        <span className="adm-info-time">
                                            <FaClock /> {formatTime(fechaFin)} hrs
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Tipo y Área */}
                    <section className="adm-section">
                        <div className="adm-section-header">
                            <FaTag />
                            <h3>Información de la Actividad</h3>
                        </div>
                        <div className="adm-info-grid adm-info-grid-2">
                            <div className="adm-info-card">
                                <span className="adm-info-card-label">Área</span>
                                <span className="adm-info-card-value">{activity.area}</span>
                            </div>
                            <div className="adm-info-card">
                                <span className="adm-info-card-label">Modalidad</span>
                                <span className="adm-info-card-value">{activity.tipo}</span>
                            </div>
                            <div className="adm-info-card">
                                <span className="adm-info-card-label">Estado</span>
                                <span className={`adm-info-card-value adm-estado-${activity.estado}`}>
                                    {activity.estado === 'activa' ? '🟢 Activa' :
                                        activity.estado === 'cerrada' ? '🔴 Cerrada' :
                                            activity.estado}
                                </span>
                            </div>
                            {cupos && (
                                <div className="adm-info-card">
                                    <span className="adm-info-card-label">Capacidad</span>
                                    <span className="adm-info-card-value">
                                        <FaUsers /> {cupos} personas
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Ubicación */}
                    <section className="adm-section">
                        <div className="adm-section-header">
                            <FaMapMarkerAlt />
                            <h3>Ubicación</h3>
                        </div>
                        <div className="adm-location-card">
                            <h4>{activity.ubicacion?.nombreLugar || "Por definir"}</h4>
                            {activity.ubicacion?.direccion && (
                                <p>{activity.ubicacion.direccion}</p>
                            )}
                            <p className="adm-location-region">
                                {activity.ubicacion?.nombreComuna}
                                {activity.ubicacion?.nombreRegion && `, ${activity.ubicacion.nombreRegion}`}
                            </p>
                            {activity.ubicacion?.nombreLugar && activity.ubicacion?.nombreComuna && (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        `${activity.ubicacion.nombreLugar}, ${activity.ubicacion.direccion || ''}, ${activity.ubicacion.nombreComuna}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="adm-map-link"
                                >
                                    Ver en Google Maps →
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Requisitos */}
                    {activity.requisitos && activity.requisitos.length > 0 && (
                        <section className="adm-section">
                            <div className="adm-section-header">
                                <FaCheckCircle />
                                <h3>Requisitos</h3>
                            </div>
                            <ul className="adm-requirements-list">
                                {activity.requisitos.map((req, index) => (
                                    <li key={index}>
                                        <FaCheckCircle /> {req}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Contacto */}
                    {activity.contacto && (
                        <section className="adm-section">
                            <div className="adm-section-header">
                                <FaInfoCircle />
                                <h3>Contacto</h3>
                            </div>
                            <div className="adm-contact-card">
                                {activity.contacto.nombre && <p><strong>Nombre:</strong> {activity.contacto.nombre}</p>}
                                {activity.contacto.email && (
                                    <p>
                                        <strong>Email:</strong>{" "}
                                        <a href={`mailto:${activity.contacto.email}`}>{activity.contacto.email}</a>
                                    </p>
                                )}
                                {activity.contacto.telefono && (
                                    <p>
                                        <strong>Teléfono:</strong>{" "}
                                        <a href={`tel:${activity.contacto.telefono}`}>{activity.contacto.telefono}</a>
                                    </p>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer con botón de inscripción */}
                {user && user.role === "estudiante" && (
                    <div className="modal-footer adm-footer">
                        <button className="am-btn am-btn-outline" onClick={onClose}>
                            Cerrar
                        </button>
                        <button
                            className="am-btn am-btn-primary"
                            onClick={handleEnroll}
                            disabled={enrolling || isEnrolled || activity.isClosed}
                        >
                            {activity.isClosed
                                ? "Convocatoria Cerrada"
                                : isEnrolled
                                    ? "✓ Ya Inscrito"
                                    : enrolling
                                        ? "Inscribiendo..."
                                        : "Inscribirme"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}