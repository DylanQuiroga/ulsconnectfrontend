import React, { useState, useEffect } from "react";
import { FaUser, FaCheck, FaTimes, FaEye, FaUserShield, FaSearch, FaFilter, FaEnvelope, FaPhone, FaUniversity } from "react-icons/fa";
import "./css/GestionUsuarios.css";
import api from "../../services/api";
import ConfirmModal from "./ConfirmModal";

interface Usuario {
    _id: string;
    nombre: string;
    correoUniversitario: string;
    correoPersonal?: string;
    telefono?: string;
    carrera?: string;
    status: string; // ✅ En el backend es 'status', no 'estado'
    role?: string;
    rut?: string;
    intereses?: string[];
    comuna?: string;
    direccion?: string;
    edad?: number;
    motivacion?: string;
    experienciaPrevia?: string;
    createdAt: string;
}

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            // ✅ CORREGIDO: Agregar /auth al inicio
            const res = await api.get('/auth/registration/requests');

            if (res.data) {
                // El endpoint devuelve directamente el array
                setUsuarios(res.data);
            }
        } catch (err: any) {
            console.error("Error al cargar usuarios:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (user: Usuario) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    const handleApproveClick = (user: Usuario) => {
        setSelectedUser(user);
        setShowApproveModal(true);
    };

    const handleRejectClick = (user: Usuario) => {
        setSelectedUser(user);
        setShowRejectModal(true);
    };

    const handleApprove = async () => {
        if (!selectedUser) return;

        setActionLoading(true);
        try {
            // ✅ CORREGIDO: Agregar /auth al inicio
            const res = await api.post(`/auth/registration/requests/${selectedUser._id}/approve`);

            if (res.data.message) {
                setUsuarios(prev => prev.filter(u => u._id !== selectedUser._id));
                setShowApproveModal(false);
                setSelectedUser(null);
                alert("Usuario aprobado exitosamente. Se ha enviado un correo de confirmación.");
            }
        } catch (err: any) {
            console.error("Error al aprobar usuario:", err);
            alert(err.response?.data?.message || "Error al aprobar usuario");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedUser) return;

        setActionLoading(true);
        try {
            // ✅ CORREGIDO: Agregar /auth al inicio
            const res = await api.post(`/auth/registration/requests/${selectedUser._id}/reject`, {
                notes: "Solicitud rechazada por el administrador"
            });

            if (res.data.message) {
                setUsuarios(prev => prev.filter(u => u._id !== selectedUser._id));
                setShowRejectModal(false);
                setSelectedUser(null);
                alert("Usuario rechazado. Se ha enviado un correo de notificación.");
            }
        } catch (err: any) {
            console.error("Error al rechazar usuario:", err);
            alert(err.response?.data?.message || "Error al rechazar usuario");
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (estado: string) => {
        const badges: Record<string, { text: string; className: string }> = {
            pending: { text: "Pendiente", className: "gu-badge-pending" },
            approved: { text: "Aprobado", className: "gu-badge-approved" },
            rejected: { text: "Rechazado", className: "gu-badge-rejected" },
            active: { text: "Activo", className: "gu-badge-active" },
            inactive: { text: "Inactivo", className: "gu-badge-inactive" },
        };

        const badge = badges[estado] || badges.pending;

        return <span className={`gu-badge ${badge.className}`}>{badge.text}</span>;
    };

    const getRoleBadge = (role: string) => {
        const badges: Record<string, { text: string; className: string }> = {
            estudiante: { text: "Estudiante", className: "gu-role-student" },
            admin: { text: "Administrador", className: "gu-role-admin" },
            staff: { text: "Staff", className: "gu-role-staff" },
        };

        const badge = badges[role] || badges.estudiante;

        return <span className={`gu-role-badge ${badge.className}`}>{badge.text}</span>;
    };

    const filteredUsuarios = usuarios.filter(user => {
        if (!searchTerm) return true;

        const search = searchTerm.toLowerCase();
        return (
            user.nombre.toLowerCase().includes(search) ||
            user.correoUniversitario.toLowerCase().includes(search) ||
            user.rut?.toLowerCase().includes(search) ||
            user.carrera?.toLowerCase().includes(search)
        );
    });

    const stats = {
        total: usuarios.length,
        pendientes: usuarios.length, // Todos son pendientes
        aprobados: 0, // No aplica en esta vista
        rechazados: 0, // No aplica en esta vista
    };

    if (loading) {
        return (
            <div className="gu-loading">
                <div className="spinner"></div>
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    return (
        <main className="gu-container">
            <header className="gu-header">
                <div>
                    <h1 className="gu-title">Gestión de Usuarios</h1>
                    <p className="gu-subtitle">Administra los registros de nuevos voluntarios</p>
                </div>

                <div className="gu-stats">
                    <div className="gu-stat-card">
                        <span className="gu-stat-number">{stats.pendientes}</span>
                        <span className="gu-stat-label">Pendientes</span>
                    </div>
                    <div className="gu-stat-card success">
                        <span className="gu-stat-number">{stats.aprobados}</span>
                        <span className="gu-stat-label">Aprobados</span>
                    </div>
                    <div className="gu-stat-card danger">
                        <span className="gu-stat-number">{stats.rechazados}</span>
                        <span className="gu-stat-label">Rechazados</span>
                    </div>
                </div>
            </header>

            <div className="gu-controls">
                <div className="gu-search">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo, RUT o carrera..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredUsuarios.length === 0 ? (
                <div className="gu-empty">
                    <FaUser />
                    <p>No hay usuarios pendientes en este momento.</p>
                </div>
            ) : (
                <div className="gu-table-container">
                    <table className="gu-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Correo</th>
                                <th>Carrera</th>
                                <th>Estado</th>
                                <th>Rol</th>
                                <th>Fecha Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="gu-user-cell">
                                            <div className="gu-user-avatar">
                                                <FaUser />
                                            </div>
                                            <div>
                                                <div className="gu-user-name">{user.nombre}</div>
                                                <div className="gu-user-rut">{user.rut}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.correoUniversitario}</td>
                                    <td>{user.carrera || "No especificada"}</td>
                                    <td>{getStatusBadge(user.status)}</td>
                                    <td>{getRoleBadge(user.role || "estudiante")}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString("es-CL")}</td>
                                    <td>
                                        <div className="gu-actions">
                                            <button
                                                className="gu-btn gu-btn-icon"
                                                onClick={() => handleViewDetails(user)}
                                                title="Ver detalles"
                                            >
                                                <FaEye />
                                            </button>
                                            {user.status === "pending" && (
                                                <>
                                                    <button
                                                        className="gu-btn gu-btn-icon success"
                                                        onClick={() => handleApproveClick(user)}
                                                        title="Aprobar"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        className="gu-btn gu-btn-icon danger"
                                                        onClick={() => handleRejectClick(user)}
                                                        title="Rechazar"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de detalles */}
            {showDetailModal && selectedUser && (
                <div className="gu-modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="gu-modal-header">
                            <h2>Detalles del Usuario</h2>
                            <button className="gu-modal-close" onClick={() => setShowDetailModal(false)}>×</button>
                        </div>
                        <div className="gu-modal-body">
                            <div className="gu-detail-section">
                                <h3>Información Personal</h3>
                                <div className="gu-detail-grid">
                                    <div className="gu-detail-item">
                                        <FaUser />
                                        <div>
                                            <strong>Nombre:</strong>
                                            <span>{selectedUser.nombre}</span>
                                        </div>
                                    </div>
                                    <div className="gu-detail-item">
                                        <FaUser />
                                        <div>
                                            <strong>RUT:</strong>
                                            <span>{selectedUser.rut}</span>
                                        </div>
                                    </div>
                                    <div className="gu-detail-item">
                                        <FaEnvelope />
                                        <div>
                                            <strong>Correo Universitario:</strong>
                                            <span>{selectedUser.correoUniversitario}</span>
                                        </div>
                                    </div>
                                    {selectedUser.correoPersonal && (
                                        <div className="gu-detail-item">
                                            <FaEnvelope />
                                            <div>
                                                <strong>Correo Personal:</strong>
                                                <span>{selectedUser.correoPersonal}</span>
                                            </div>
                                        </div>
                                    )}
                                    {selectedUser.telefono && (
                                        <div className="gu-detail-item">
                                            <FaPhone />
                                            <div>
                                                <strong>Teléfono:</strong>
                                                <span>{selectedUser.telefono}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="gu-detail-item">
                                        <FaUniversity />
                                        <div>
                                            <strong>Carrera:</strong>
                                            <span>{selectedUser.carrera || "No especificada"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedUser.intereses && selectedUser.intereses.length > 0 && (
                                <div className="gu-detail-section">
                                    <h3>Áreas de Interés</h3>
                                    <div className="gu-interests">
                                        {selectedUser.intereses.map((interes, idx) => (
                                            <span key={idx} className="gu-interest-tag">{interes}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedUser.motivacion && (
                                <div className="gu-detail-section">
                                    <h3>Motivación</h3>
                                    <p>{selectedUser.motivacion}</p>
                                </div>
                            )}

                            {selectedUser.experienciaPrevia && (
                                <div className="gu-detail-section">
                                    <h3>Experiencia Previa</h3>
                                    <p>{selectedUser.experienciaPrevia}</p>
                                </div>
                            )}
                        </div>
                        <div className="gu-modal-footer">
                            {selectedUser.status === "pending" && (
                                <>
                                    <button
                                        className="gu-btn gu-btn-success"
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            handleApproveClick(selectedUser);
                                        }}
                                    >
                                        <FaCheck /> Aprobar Usuario
                                    </button>
                                    <button
                                        className="gu-btn gu-btn-danger"
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            handleRejectClick(selectedUser);
                                        }}
                                    >
                                        <FaTimes /> Rechazar Usuario
                                    </button>
                                </>
                            )}
                            <button className="gu-btn gu-btn-secondary" onClick={() => setShowDetailModal(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de aprobación */}
            {showApproveModal && selectedUser && (
                <ConfirmModal
                    title="Aprobar Usuario"
                    message={`¿Estás seguro de que deseas aprobar a ${selectedUser.nombre}? Se enviará un correo de confirmación y podrá iniciar sesión.`}
                    confirmText={actionLoading ? "Aprobando..." : "Sí, aprobar"}
                    cancelText="Cancelar"
                    onConfirm={handleApprove}
                    onCancel={() => {
                        setShowApproveModal(false);
                        setSelectedUser(null);
                    }}
                    variant="info"
                />
            )}

            {/* Modal de confirmación de rechazo */}
            {showRejectModal && selectedUser && (
                <ConfirmModal
                    title="Rechazar Usuario"
                    message={`¿Estás seguro de que deseas rechazar a ${selectedUser.nombre}? Se enviará un correo de notificación.`}
                    confirmText={actionLoading ? "Rechazando..." : "Sí, rechazar"}
                    cancelText="Cancelar"
                    onConfirm={handleReject}
                    onCancel={() => {
                        setShowRejectModal(false);
                        setSelectedUser(null);
                    }}
                    variant="danger"
                />
            )}
        </main>
    );
}