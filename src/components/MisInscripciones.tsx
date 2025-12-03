import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTrash, FaEye, FaCheckCircle, FaClock as FaPending, FaTimes } from "react-icons/fa";
import "./css/MisInscripciones.css";
import api from "../services/api";
import { useAuthStore } from "../stores/sessionStore";
import ActivityDetailModal from "./ActivityDetailModal";
import ConfirmModal from "./admin/ConfirmModal";

interface Enrollment {
    _id: string;
    idActividad: {
        _id: string;
        titulo: string;
        descripcion: string;
        area: string;
        tipo: string;
        fechaInicio: string;
        fechaTermino?: string;
        horaInicio?: string;
        horaTermino?: string;
        ubicacion: {
            nombreLugar: string;
            direccion: string;
            nombreComuna: string;
            nombreRegion: string;
        };
        cuposDisponibles?: number;
        estado: string;
        imagenUrl?: string;
        requisitos?: string[];
        contacto?: any;
    };
    estado: string;
    fechaInscripcion?: string; // ✅ CAMBIADO: Opcional con ?
    creadoEn: string; // ✅ AGREGADO: Campo de timestamps
    notas?: string;
}

export default function MisInscripciones() {
    const { user } = useAuthStore();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"todas" | "activas" | "pasadas">("todas");

    // Estados para modales
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [enrollmentToCancel, setEnrollmentToCancel] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchEnrollments();
    }, [user]);

    const fetchEnrollments = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const res = await api.get(`/inscripciones/${user.id}/activas`);

            if (res.data.success) {
                // Normalizar: aceptar objetos con 'actividad' o 'idActividad'
                const normalized = (res.data.data || []).map((ins: any) => {
                    const idActividad = ins.idActividad ?? ins.actividad ?? null;
                    return {
                        ...ins,
                        idActividad,
                    };
                });

                setEnrollments(normalized);
            }
        } catch (err: any) {
            console.error("Error al cargar inscripciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (enrollment: Enrollment) => {
        setSelectedActivity({
            _id: enrollment.idActividad._id,
            titulo: enrollment.idActividad.titulo,
            descripcion: enrollment.idActividad.descripcion,
            area: enrollment.idActividad.area,
            tipo: enrollment.idActividad.tipo,
            fechaInicio: enrollment.idActividad.fechaInicio,
            fechaTermino: enrollment.idActividad.fechaTermino,
            horaInicio: enrollment.idActividad.horaInicio,
            horaTermino: enrollment.idActividad.horaTermino,
            ubicacion: enrollment.idActividad.ubicacion,
            cuposDisponibles: enrollment.idActividad.cuposDisponibles,
            estado: enrollment.idActividad.estado,
            imagenUrl: enrollment.idActividad.imagenUrl,
            requisitos: enrollment.idActividad.requisitos,
            contacto: enrollment.idActividad.contacto,
            enrolled: true,
        });
        setShowDetailModal(true);
    };

    const handleCancelClick = (enrollmentId: string) => {
        setEnrollmentToCancel(enrollmentId);
        setShowCancelModal(true);
    };

    const handleCancelEnrollment = async () => {
        if (!enrollmentToCancel) return;

        setCancelling(true);
        try {
            const res = await api.delete(`/inscripciones/${enrollmentToCancel}`);

            if (res.data.success) {
                setEnrollments(prev => prev.filter(e => e._id !== enrollmentToCancel));
                setShowCancelModal(false);
                setEnrollmentToCancel(null);
            }
        } catch (err: any) {
            console.error("Error al cancelar inscripción:", err);
            alert(err.response?.data?.error || "Error al cancelar inscripción");
        } finally {
            setCancelling(false);
        }
    };

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

    const formatTime = (time: string) => {
        if (!time) return "";
        return time.substring(0, 5);
    };

    const getStatusBadge = (estado: string) => {
        const badges: Record<string, { text: string; icon: any; className: string }> = {
            inscrito: { text: "Inscrito", icon: FaCheckCircle, className: "mi-badge-inscrito" },
            pendiente: { text: "Pendiente", icon: FaPending, className: "mi-badge-pendiente" },
            confirmado: { text: "Confirmado", icon: FaCheckCircle, className: "mi-badge-confirmado" },
            rechazado: { text: "Rechazado", icon: FaTimes, className: "mi-badge-rechazado" },
            cancelado: { text: "Cancelado", icon: FaTimes, className: "mi-badge-cancelado" },
        };

        const badge = badges[estado] || badges.inscrito;
        const Icon = badge.icon;

        return (
            <span className={`mi-badge ${badge.className}`}>
                <Icon /> {badge.text}
            </span>
        );
    };

    const filteredEnrollments = enrollments.filter((enrollment) => {
        if (filter === "todas") return true;

        // Acceso seguro a fechaInicio
        const fechaStr = enrollment.idActividad?.fechaInicio;
        if (!fechaStr) {
            // Si no hay fecha, incluir en "activas" (evita crash)
            return filter === "activas";
        }

        const activityDate = new Date(fechaStr);
        if (isNaN(activityDate.getTime())) {
            return filter === "activas";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === "activas") {
            return activityDate >= today && enrollment.estado !== "cancelado";
        } else {
            return activityDate < today || enrollment.estado === "cancelado";
        }
    });

    if (loading) {
        return (
            <div className="mi-loading">
                <div className="spinner"></div>
                <p>Cargando tus inscripciones...</p>
            </div>
        );
    }

    return (
        <main className="mi-container">
            <header className="mi-header">
                <div>
                    <h1 className="mi-title">Mis Inscripciones</h1>
                    <p className="mi-subtitle">
                        Gestiona tus actividades de voluntariado
                    </p>
                </div>

                <div className="mi-stats">
                    <div className="mi-stat-card">
                        <span className="mi-stat-number">{enrollments.length}</span>
                        <span className="mi-stat-label">Total</span>
                    </div>
                    <div className="mi-stat-card">
                        <span className="mi-stat-number">
                            {enrollments.filter(e => {
                                const date = new Date(e.idActividad.fechaInicio);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date >= today && e.estado !== "cancelado";
                            }).length}
                        </span>
                        <span className="mi-stat-label">Activas</span>
                    </div>
                </div>
            </header>

            <div className="mi-filters">
                <button
                    className={`mi-filter-btn ${filter === "todas" ? "active" : ""}`}
                    onClick={() => setFilter("todas")}
                >
                    Todas
                </button>
                <button
                    className={`mi-filter-btn ${filter === "activas" ? "active" : ""}`}
                    onClick={() => setFilter("activas")}
                >
                    Próximas
                </button>
                <button
                    className={`mi-filter-btn ${filter === "pasadas" ? "active" : ""}`}
                    onClick={() => setFilter("pasadas")}
                >
                    Pasadas
                </button>
            </div>

            {filteredEnrollments.length === 0 ? (
                <div className="mi-empty">
                    <p>No tienes inscripciones {filter === "todas" ? "" : filter === "activas" ? "próximas" : "pasadas"}.</p>
                    <a href="/convocatorias_panel" className="mi-btn mi-btn-primary">
                        Explorar Convocatorias
                    </a>
                </div>
            ) : (
                <div className="mi-grid">
                    {filteredEnrollments.map((enrollment) => (
                        <article key={enrollment._id} className="mi-card">
                            <div className="mi-card-header">
                                <div>
                                    <span className={`mi-area-badge mi-area-${enrollment.idActividad.area.toLowerCase().replace(" ", "-")}`}>
                                        {enrollment.idActividad.area}
                                    </span>
                                    {getStatusBadge(enrollment.estado)}
                                </div>
                                <span className="mi-date-badge">
                                    Inscrito: {new Date(enrollment.fechaInscripcion || enrollment.creadoEn).toLocaleDateString("es-CL")}
                                </span>
                            </div>

                            <h3 className="mi-card-title">{enrollment.idActividad.titulo}</h3>
                            <p className="mi-card-description">
                                {enrollment.idActividad.descripcion?.substring(0, 120)}...
                            </p>

                            <div className="mi-card-meta">
                                <div className="mi-meta-item">
                                    <FaCalendarAlt />
                                    <span>{formatDate(enrollment.idActividad.fechaInicio)}</span>
                                </div>
                                {enrollment.idActividad.horaInicio && (
                                    <div className="mi-meta-item">
                                        <FaClock />
                                        <span>{formatTime(enrollment.idActividad.horaInicio)}</span>
                                    </div>
                                )}
                                <div className="mi-meta-item">
                                    <FaMapMarkerAlt />
                                    <span>{enrollment.idActividad.ubicacion.nombreComuna}</span>
                                </div>
                            </div>

                            <div className="mi-card-actions">
                                <button
                                    className="mi-btn mi-btn-ghost"
                                    onClick={() => handleViewDetails(enrollment)}
                                >
                                    <FaEye /> Ver Detalles
                                </button>
                                {enrollment.estado !== "cancelado" && (
                                    <button
                                        className="mi-btn mi-btn-danger"
                                        onClick={() => handleCancelClick(enrollment._id)}
                                    >
                                        <FaTrash /> Cancelar
                                    </button>
                                )}
                            </div>

                            {enrollment.notas && (
                                <div className="mi-notes">
                                    <strong>Notas:</strong> {enrollment.notas}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

            {/* Modal de detalles */}
            {showDetailModal && selectedActivity && (
                <ActivityDetailModal
                    activity={selectedActivity}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedActivity(null);
                    }}
                />
            )}

            {/* Modal de confirmación de cancelación */}
            {showCancelModal && (
                <ConfirmModal
                    title="Cancelar Inscripción"
                    message="¿Estás seguro de que deseas cancelar tu inscripción a esta actividad? Esta acción no se puede deshacer."
                    confirmText={cancelling ? "Cancelando..." : "Sí, cancelar"}
                    cancelText="No, mantener"
                    onConfirm={handleCancelEnrollment}
                    onCancel={() => {
                        setShowCancelModal(false);
                        setEnrollmentToCancel(null);
                    }}
                    variant="danger"
                />
            )}
        </main>
    );
}