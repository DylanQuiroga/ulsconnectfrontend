import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaLock, FaSearch, FaEye, FaClipboardList } from "react-icons/fa"; // ✅ Agregar FaEye y FaClipboardList
import "./css/ActivityManagement.css";
import api from "../services/api";
import ActivityFormModal from "../components/admin/ActivityFormModal";
import ConfirmModal from "../components/admin/ConfirmModal";
import CloseActivityModal from "../components/admin/CloseActivityModal";
import ActivityDetailModal from "../components/ActivityDetailModal"; // ✅ NUEVO
import AttendanceModal from "../components/admin/AttendanceModal"; // ✅ NUEVO

interface Activity {
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
    motivoCierre?: string;
    fechaCierre?: string;
}

export default function ActivityManagement() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterArea, setFilterArea] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Modals
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    // ✅ NUEVO: Estado para el modal de detalles
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);

    useEffect(() => {
        loadActivities();
    }, []);

    useEffect(() => {
        filterActivities();
    }, [activities, searchQuery, filterArea, filterStatus]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const res = await api.get("/events");
            if (res.data.success) {
                setActivities(res.data.data);
            }
        } catch (error: any) {
            console.error("Error al cargar actividades:", error);
            alert("Error al cargar actividades: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const filterActivities = () => {
        let filtered = [...activities];

        // Filtro por búsqueda
        if (searchQuery) {
            filtered = filtered.filter(
                (act) =>
                    act.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    act.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtro por área
        if (filterArea !== "all") {
            filtered = filtered.filter((act) => act.area === filterArea);
        }

        // Filtro por estado
        if (filterStatus !== "all") {
            filtered = filtered.filter((act) => act.estado === filterStatus);
        }

        setFilteredActivities(filtered);
    };

    const handleCreate = () => {
        setSelectedActivity(null);
        setShowFormModal(true);
    };

    const handleEdit = (activity: Activity) => {
        setSelectedActivity(activity);
        setShowFormModal(true);
    };

    const handleDeleteClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedActivity) return;

        try {
            const res = await api.delete(`/events/${selectedActivity._id}`);
            if (res.data.success) {
                alert("Actividad eliminada correctamente");
                loadActivities();
                setShowDeleteModal(false);
            }
        } catch (error: any) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar: " + (error.response?.data?.error || error.message));
        }
    };

    const handleCloseClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setShowCloseModal(true);
    };

    // ✅ NUEVO: Handler para ver detalles
    const handleViewDetails = (activity: Activity) => {
        setSelectedActivity(activity);
        setShowDetailModal(true);
    };

    const handleAttendanceClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setShowAttendanceModal(true);
    };

    const handleFormSuccess = () => {
        setShowFormModal(false);
        loadActivities();
    };

    const handleCloseSuccess = () => {
        setShowCloseModal(false);
        loadActivities();
    };

    if (loading) {
        return (
            <div className="am-loading">
                <div className="spinner"></div>
                <p>Cargando actividades...</p>
            </div>
        );
    }

    return (
        <div className="am-container">
            <header className="am-header">
                <div className="am-header-content">
                    <h1>Gestión de Actividades</h1>
                    <p className="am-subtitle">
                        Administra todas las actividades de voluntariado
                    </p>
                </div>
                <button className="am-btn am-btn-primary" onClick={handleCreate}>
                    <FaPlus /> Nueva Actividad
                </button>
            </header>

            {/* Filtros */}
            <div className="am-filters">
                <div className="am-search">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Buscar por título o descripción..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    className="am-filter-select"
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                >
                    <option value="all">Todas las áreas</option>
                    <option value="Medio Ambiente">Medio Ambiente</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Adulto mayor">Adulto mayor</option>
                </select>

                <select
                    className="am-filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Todos los estados</option>
                    <option value="activa">Activa</option>
                    <option value="closed">Cerrada</option>
                    <option value="completada">Completada</option>
                </select>
            </div>

            {/* Estadísticas rápidas */}
            <div className="am-stats">
                <div className="am-stat-card">
                    <span className="am-stat-label">Total</span>
                    <span className="am-stat-value">{activities.length}</span>
                </div>
                <div className="am-stat-card">
                    <span className="am-stat-label">Activas</span>
                    <span className="am-stat-value">
                        {activities.filter((a) => a.estado === "activa").length}
                    </span>
                </div>
                <div className="am-stat-card">
                    <span className="am-stat-label">Cerradas</span>
                    <span className="am-stat-value">
                        {activities.filter((a) => a.estado === "closed").length}
                    </span>
                </div>
            </div>

            {/* Tabla de actividades */}
            {filteredActivities.length === 0 ? (
                <div className="am-empty">
                    <p>No se encontraron actividades con los filtros aplicados</p>
                    <button className="am-btn am-btn-outline" onClick={handleCreate}>
                        <FaPlus /> Crear Primera Actividad
                    </button>
                </div>
            ) : (
                <div className="am-table-container">
                    <table className="am-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Área</th>
                                <th>Fecha Inicio</th>
                                <th>Ubicación</th>
                                <th>Cupos</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.map((activity) => (
                                <tr key={activity._id}>
                                    <td>
                                        <div className="am-activity-title">
                                            <strong>{activity.titulo}</strong>
                                            <span className="am-activity-type">{activity.tipo}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`am-badge am-badge-${activity.area.toLowerCase().replace(" ", "-")}`}>
                                            {activity.area}
                                        </span>
                                    </td>
                                    <td>
                                        {activity.fechaInicio
                                            ? new Date(activity.fechaInicio).toLocaleDateString("es-CL")
                                            : "Sin fecha"}
                                    </td>
                                    <td>
                                        <div className="am-location">
                                            <span>{activity.ubicacion.nombreLugar}</span>
                                            <small>{activity.ubicacion.nombreComuna}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="am-cupos">
                                            {activity.cuposDisponibles || "Ilimitado"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`am-status am-status-${activity.estado}`}>
                                            {activity.estado === "activa" && "Activa"}
                                            {activity.estado === "closed" && "Cerrada"}
                                            {activity.estado === "completada" && "Completada"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="am-actions">
                                            {/* ✅ NUEVO: Botón para ver detalles */}
                                            <button
                                                className="am-action-btn am-action-view"
                                                onClick={() => handleViewDetails(activity)}
                                                title="Ver detalles"
                                            >
                                                <FaEye />
                                            </button>

                                            <button
                                                className="am-action-btn am-action-attendance"
                                                onClick={() => handleAttendanceClick(activity)}
                                                title="Gestionar Asistencia"
                                            >
                                                <FaClipboardList />
                                            </button>

                                            <button
                                                className="am-action-btn am-action-edit"
                                                onClick={() => handleEdit(activity)}
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </button>

                                            {activity.estado === "activa" && (
                                                <button
                                                    className="am-action-btn am-action-close"
                                                    onClick={() => handleCloseClick(activity)}
                                                    title="Cerrar convocatoria"
                                                >
                                                    <FaLock />
                                                </button>
                                            )}

                                            <button
                                                className="am-action-btn am-action-delete"
                                                onClick={() => handleDeleteClick(activity)}
                                                title="Eliminar"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {showFormModal && (
                <ActivityFormModal
                    activity={selectedActivity}
                    onClose={() => setShowFormModal(false)}
                    onSuccess={handleFormSuccess}
                />
            )}

            {showDeleteModal && selectedActivity && (
                <ConfirmModal
                    title="Eliminar Actividad"
                    message={`¿Estás seguro de eliminar "${selectedActivity.titulo}"? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    variant="danger"
                />
            )}

            {showCloseModal && selectedActivity && (
                <CloseActivityModal
                    activity={selectedActivity}
                    onClose={() => setShowCloseModal(false)}
                    onSuccess={handleCloseSuccess}
                />
            )}

            {/* ✅ NUEVO: Modal de detalles */}
            {showDetailModal && selectedActivity && (
                <ActivityDetailModal
                    activity={selectedActivity}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedActivity(null);
                    }}
                />
            )}

            {showAttendanceModal && selectedActivity && (
                <AttendanceModal
                    activityId={selectedActivity._id}
                    activityTitle={selectedActivity.titulo}
                    onClose={() => {
                        setShowAttendanceModal(false);
                        setSelectedActivity(null);
                    }}
                />
            )}
        </div>
    );
}