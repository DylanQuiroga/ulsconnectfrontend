import React, { useEffect, useState } from "react";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaCalendar, FaCheck, FaTimes, FaEye, FaUserCog, FaLock, FaUnlock, FaUsers, FaHeart } from "react-icons/fa";
import { adminService, RegistrationRequest, Usuario } from "../../services/adminService";
import ConfirmModal from "./ConfirmModal";
import "./css/GestionUsuarios.css";

type TabType = 'solicitudes' | 'usuarios';
type FilterType = 'all' | 'pending' | 'approved' | 'rejected';
type UserFilterType = 'all' | 'estudiante' | 'staff' | 'admin' | 'blocked';

export default function GestionUsuarios() {
    // Tab actual
    const [activeTab, setActiveTab] = useState<TabType>('solicitudes');

    // Solicitudes de registro
    const [allSolicitudes, setAllSolicitudes] = useState<RegistrationRequest[]>([]); // Para stats
    const [solicitudes, setSolicitudes] = useState<RegistrationRequest[]>([]);
    const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
    const [solicitudFilter, setSolicitudFilter] = useState<FilterType>('pending');

    // Usuarios existentes
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [userFilter, setUserFilter] = useState<UserFilterType>('all');

    // Búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    // Modales
    const [selectedItem, setSelectedItem] = useState<RegistrationRequest | Usuario | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [rejectNotes, setRejectNotes] = useState("");
    const [newRole, setNewRole] = useState<'estudiante' | 'staff' | 'admin'>('estudiante');

    // Estado de acciones
    const [actionLoading, setActionLoading] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        if (activeTab === 'solicitudes') {
            fetchAllSolicitudes();
        } else {
            fetchUsuarios();
        }
    }, [activeTab]);

    // Filtrar solicitudes cuando cambia el filtro
    useEffect(() => {
        if (solicitudFilter === 'all') {
            setSolicitudes(allSolicitudes);
        } else {
            setSolicitudes(allSolicitudes.filter(s => s.status === solicitudFilter));
        }
    }, [solicitudFilter, allSolicitudes]);

    // ============== FETCH FUNCTIONS ==============
    const fetchAllSolicitudes = async () => {
        setLoadingSolicitudes(true);
        try {
            // Cargar todas las solicitudes para tener los stats correctos
            const data = await adminService.getRegistrationRequests();
            setAllSolicitudes(Array.isArray(data) ? data : []);

            // Aplicar filtro inicial
            if (solicitudFilter === 'all') {
                setSolicitudes(Array.isArray(data) ? data : []);
            } else {
                setSolicitudes((Array.isArray(data) ? data : []).filter(s => s.status === solicitudFilter));
            }
        } catch (err: any) {
            console.error("Error fetching solicitudes:", err);
            setAllSolicitudes([]);
            setSolicitudes([]);
        } finally {
            setLoadingSolicitudes(false);
        }
    };

    const fetchUsuarios = async () => {
        setLoadingUsuarios(true);
        try {
            const filters: { search?: string; role?: string; blocked?: boolean } = {};
            if (searchTerm) filters.search = searchTerm;
            if (userFilter === 'blocked') {
                filters.blocked = true;
            } else if (userFilter !== 'all') {
                filters.role = userFilter;
            }

            const data = await adminService.getUsers(filters);
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error fetching usuarios:", err);
            setUsuarios([]);
        } finally {
            setLoadingUsuarios(false);
        }
    };

    // Refetch usuarios cuando cambia el filtro
    useEffect(() => {
        if (activeTab === 'usuarios') {
            fetchUsuarios();
        }
    }, [userFilter]);

    // ============== ACCIONES SOLICITUDES ==============
    const handleApprove = async () => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            await adminService.approveRegistration(selectedItem._id);
            alert("✅ Solicitud aprobada exitosamente. El usuario recibirá un correo de confirmación.");
            setShowApproveModal(false);
            setSelectedItem(null);
            fetchAllSolicitudes();
        } catch (err: any) {
            alert("Error: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            await adminService.rejectRegistration(selectedItem._id, rejectNotes);
            alert("❌ Solicitud rechazada");
            setShowRejectModal(false);
            setSelectedItem(null);
            setRejectNotes("");
            fetchAllSolicitudes();
        } catch (err: any) {
            alert("Error: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    // ============== ACCIONES USUARIOS ==============
    const handleChangeRole = async () => {
        if (!selectedItem || !('rol' in selectedItem)) return;
        setActionLoading(true);
        try {
            await adminService.updateUserRole(selectedItem._id, newRole);
            alert(`✅ Rol actualizado a ${newRole}`);
            setShowRoleModal(false);
            setSelectedItem(null);
            fetchUsuarios();
        } catch (err: any) {
            alert("Error: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleBlock = async () => {
        if (!selectedItem || !('bloqueado' in selectedItem)) return;
        const usuario = selectedItem as Usuario;
        setActionLoading(true);
        try {
            await adminService.toggleUserBlock(usuario._id, !usuario.bloqueado);
            alert(usuario.bloqueado ? "✅ Usuario desbloqueado" : "🚫 Usuario bloqueado");
            setShowBlockModal(false);
            setSelectedItem(null);
            fetchUsuarios();
        } catch (err: any) {
            alert("Error: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    // ============== HELPERS ==============
    const getStatusBadgeClass = (status: string) => {
        const classes: Record<string, string> = {
            pending: 'gu-badge gu-badge-pending',
            approved: 'gu-badge gu-badge-approved',
            rejected: 'gu-badge gu-badge-rejected'
        };
        return classes[status] || 'gu-badge';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            pending: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado'
        };
        return texts[status] || status;
    };

    const getRoleBadgeClass = (rol: string) => {
        const classes: Record<string, string> = {
            admin: 'gu-role-badge gu-role-admin',
            staff: 'gu-role-badge gu-role-staff',
            estudiante: 'gu-role-badge gu-role-student'
        };
        return classes[rol] || 'gu-role-badge';
    };

    const getRoleText = (rol: string) => {
        const texts: Record<string, string> = {
            admin: 'Administrador',
            staff: 'Staff',
            estudiante: 'Estudiante'
        };
        return texts[rol] || rol;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filtrar localmente por búsqueda
    const filteredSolicitudes = solicitudes.filter(sol => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return sol.nombre.toLowerCase().includes(term) ||
            sol.correoUniversitario.toLowerCase().includes(term) ||
            (sol.carrera && sol.carrera.toLowerCase().includes(term));
    });

    const filteredUsuarios = Array.isArray(usuarios) ? usuarios.filter(user => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return user.nombre.toLowerCase().includes(term) ||
            user.correoUniversitario.toLowerCase().includes(term) ||
            (user.carrera && user.carrera.toLowerCase().includes(term));
    }) : [];

    // Stats - usar allSolicitudes para tener los números correctos
    const solicitudesStats = {
        pending: allSolicitudes.filter(s => s.status === 'pending').length,
        approved: allSolicitudes.filter(s => s.status === 'approved').length,
        rejected: allSolicitudes.filter(s => s.status === 'rejected').length
    };

    const usuariosArray = Array.isArray(usuarios) ? usuarios : [];
    const usuariosStats = {
        total: usuariosArray.length,
        estudiantes: usuariosArray.filter(u => u.rol === 'estudiante').length,
        staff: usuariosArray.filter(u => u.rol === 'staff').length,
        admins: usuariosArray.filter(u => u.rol === 'admin').length,
        bloqueados: usuariosArray.filter(u => u.bloqueado).length
    };

    return (
        <div className="gu-container">
            {/* Header */}
            <header className="gu-header">
                <div>
                    <h1 className="gu-title">
                        {activeTab === 'solicitudes' ? '📋 Solicitudes de Registro' : '👥 Gestión de Usuarios'}
                    </h1>
                    <p className="gu-subtitle">
                        {activeTab === 'solicitudes'
                            ? 'Revisa y aprueba las solicitudes de nuevos voluntarios'
                            : 'Administra los usuarios del sistema'}
                    </p>
                </div>
                <div className="gu-stats">
                    {activeTab === 'solicitudes' ? (
                        <>
                            <div className="gu-stat-card">
                                <span className="gu-stat-number">{solicitudesStats.pending}</span>
                                <span className="gu-stat-label">Pendientes</span>
                            </div>
                            <div className="gu-stat-card success">
                                <span className="gu-stat-number">{solicitudesStats.approved}</span>
                                <span className="gu-stat-label">Aprobadas</span>
                            </div>
                            <div className="gu-stat-card danger">
                                <span className="gu-stat-number">{solicitudesStats.rejected}</span>
                                <span className="gu-stat-label">Rechazadas</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="gu-stat-card">
                                <span className="gu-stat-number">{usuariosStats.total}</span>
                                <span className="gu-stat-label">Total</span>
                            </div>
                            <div className="gu-stat-card success">
                                <span className="gu-stat-number">{usuariosStats.estudiantes}</span>
                                <span className="gu-stat-label">Estudiantes</span>
                            </div>
                            <div className="gu-stat-card danger">
                                <span className="gu-stat-number">{usuariosStats.bloqueados}</span>
                                <span className="gu-stat-label">Bloqueados</span>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Tabs */}
            <div className="gu-controls">
                <div className="gu-filters">
                    <button
                        className={`gu-filter-btn ${activeTab === 'solicitudes' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('solicitudes'); setSearchTerm(''); }}
                    >
                        📋 Solicitudes
                    </button>
                    <button
                        className={`gu-filter-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('usuarios'); setSearchTerm(''); }}
                    >
                        👤 Usuarios
                    </button>
                </div>

                {/* Search */}
                <div className="gu-search">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder={activeTab === 'solicitudes'
                            ? "Buscar por nombre, correo o carrera..."
                            : "Buscar usuarios..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filtros específicos */}
                <div className="gu-filters">
                    {activeTab === 'solicitudes' ? (
                        <>
                            <button
                                className={`gu-filter-btn ${solicitudFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setSolicitudFilter('all')}
                            >
                                Todas ({allSolicitudes.length})
                            </button>
                            <button
                                className={`gu-filter-btn ${solicitudFilter === 'pending' ? 'active' : ''}`}
                                onClick={() => setSolicitudFilter('pending')}
                            >
                                Pendientes ({solicitudesStats.pending})
                            </button>
                            <button
                                className={`gu-filter-btn ${solicitudFilter === 'approved' ? 'active' : ''}`}
                                onClick={() => setSolicitudFilter('approved')}
                            >
                                Aprobadas ({solicitudesStats.approved})
                            </button>
                            <button
                                className={`gu-filter-btn ${solicitudFilter === 'rejected' ? 'active' : ''}`}
                                onClick={() => setSolicitudFilter('rejected')}
                            >
                                Rechazadas ({solicitudesStats.rejected})
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`gu-filter-btn ${userFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setUserFilter('all')}
                            >
                                Todos
                            </button>
                            <button
                                className={`gu-filter-btn ${userFilter === 'estudiante' ? 'active' : ''}`}
                                onClick={() => setUserFilter('estudiante')}
                            >
                                Estudiantes
                            </button>
                            <button
                                className={`gu-filter-btn ${userFilter === 'staff' ? 'active' : ''}`}
                                onClick={() => setUserFilter('staff')}
                            >
                                Staff
                            </button>
                            <button
                                className={`gu-filter-btn ${userFilter === 'admin' ? 'active' : ''}`}
                                onClick={() => setUserFilter('admin')}
                            >
                                Admins
                            </button>
                            <button
                                className={`gu-filter-btn ${userFilter === 'blocked' ? 'active' : ''}`}
                                onClick={() => setUserFilter('blocked')}
                            >
                                Bloqueados
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ============== TAB: SOLICITUDES ============== */}
            {activeTab === 'solicitudes' && (
                <>
                    {loadingSolicitudes ? (
                        <div className="gu-loading">
                            <div className="spinner"></div>
                            <p>Cargando solicitudes...</p>
                        </div>
                    ) : filteredSolicitudes.length === 0 ? (
                        <div className="gu-empty">
                            <FaUsers />
                            <p>
                                {searchTerm
                                    ? 'No se encontraron solicitudes que coincidan con la búsqueda'
                                    : solicitudFilter === 'pending'
                                        ? '¡No hay solicitudes pendientes! 🎉'
                                        : 'No hay solicitudes en esta categoría'}
                            </p>
                        </div>
                    ) : (
                        <div className="gu-table-container">
                            <table className="gu-table">
                                <thead>
                                    <tr>
                                        <th>Solicitante</th>
                                        <th>Correo</th>
                                        <th>Carrera</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSolicitudes.map((sol) => (
                                        <tr key={sol._id}>
                                            <td>
                                                <div className="gu-user-cell">
                                                    <div className="gu-user-avatar">
                                                        <FaUser />
                                                    </div>
                                                    <div>
                                                        <div className="gu-user-name">{sol.nombre}</div>
                                                        {sol.telefono && (
                                                            <div className="gu-user-rut">{sol.telefono}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{sol.correoUniversitario}</td>
                                            <td>{sol.carrera || '-'}</td>
                                            <td>{formatDate(sol.createdAt)}</td>
                                            <td>
                                                <span className={getStatusBadgeClass(sol.status)}>
                                                    {getStatusText(sol.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="gu-actions">
                                                    <button
                                                        className="gu-btn gu-btn-icon"
                                                        onClick={() => { setSelectedItem(sol); setShowDetailModal(true); }}
                                                        title="Ver detalles"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    {sol.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="gu-btn gu-btn-icon success"
                                                                onClick={() => { setSelectedItem(sol); setShowApproveModal(true); }}
                                                                title="Aprobar"
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                            <button
                                                                className="gu-btn gu-btn-icon danger"
                                                                onClick={() => { setSelectedItem(sol); setShowRejectModal(true); }}
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
                </>
            )}

            {/* ============== TAB: USUARIOS ============== */}
            {activeTab === 'usuarios' && (
                <>
                    {loadingUsuarios ? (
                        <div className="gu-loading">
                            <div className="spinner"></div>
                            <p>Cargando usuarios...</p>
                        </div>
                    ) : filteredUsuarios.length === 0 ? (
                        <div className="gu-empty">
                            <FaUsers />
                            <p>No se encontraron usuarios</p>
                        </div>
                    ) : (
                        <div className="gu-table-container">
                            <table className="gu-table">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Correo</th>
                                        <th>Carrera</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsuarios.map((user) => (
                                        <tr key={user._id} style={user.bloqueado ? { backgroundColor: '#fef2f2' } : {}}>
                                            <td>
                                                <div className="gu-user-cell">
                                                    <div className="gu-user-avatar">
                                                        <FaUser />
                                                    </div>
                                                    <div>
                                                        <div className="gu-user-name">{user.nombre}</div>
                                                        {user.rut && (
                                                            <div className="gu-user-rut">{user.rut}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.correoUniversitario}</td>
                                            <td>{user.carrera || '-'}</td>
                                            <td>
                                                <span className={getRoleBadgeClass(user.rol)}>
                                                    {getRoleText(user.rol)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`gu-badge ${user.bloqueado ? 'gu-badge-rejected' : 'gu-badge-approved'}`}>
                                                    {user.bloqueado ? 'Bloqueado' : 'Activo'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="gu-actions">
                                                    <button
                                                        className="gu-btn gu-btn-icon"
                                                        onClick={() => { setSelectedItem(user); setShowDetailModal(true); }}
                                                        title="Ver detalles"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        className="gu-btn gu-btn-icon"
                                                        onClick={() => {
                                                            setSelectedItem(user);
                                                            setNewRole(user.rol as 'estudiante' | 'staff' | 'admin');
                                                            setShowRoleModal(true);
                                                        }}
                                                        title="Cambiar rol"
                                                    >
                                                        <FaUserCog />
                                                    </button>
                                                    <button
                                                        className={`gu-btn gu-btn-icon ${user.bloqueado ? 'success' : 'danger'}`}
                                                        onClick={() => { setSelectedItem(user); setShowBlockModal(true); }}
                                                        title={user.bloqueado ? 'Desbloquear' : 'Bloquear'}
                                                    >
                                                        {user.bloqueado ? <FaUnlock /> : <FaLock />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* ============== MODALES ============== */}

            {/* Modal de Detalles */}
            {showDetailModal && selectedItem && (
                <div className="gu-modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="gu-modal-header">
                            <h2>
                                {'rol' in selectedItem ? 'Detalles del Usuario' : 'Detalles de la Solicitud'}
                            </h2>
                            <button className="gu-modal-close" onClick={() => setShowDetailModal(false)}>×</button>
                        </div>
                        <div className="gu-modal-body">
                            <div className="gu-detail-section">
                                <h3>Información Personal</h3>
                                <div className="gu-detail-grid">
                                    <div className="gu-detail-item">
                                        <FaUser />
                                        <div>
                                            <strong>Nombre</strong>
                                            <span>{selectedItem.nombre}</span>
                                        </div>
                                    </div>
                                    <div className="gu-detail-item">
                                        <FaEnvelope />
                                        <div>
                                            <strong>Correo</strong>
                                            <span>{selectedItem.correoUniversitario}</span>
                                        </div>
                                    </div>
                                    {'telefono' in selectedItem && selectedItem.telefono && (
                                        <div className="gu-detail-item">
                                            <FaPhone />
                                            <div>
                                                <strong>Teléfono</strong>
                                                <span>{selectedItem.telefono}</span>
                                            </div>
                                        </div>
                                    )}
                                    {'carrera' in selectedItem && selectedItem.carrera && (
                                        <div className="gu-detail-item">
                                            <FaGraduationCap />
                                            <div>
                                                <strong>Carrera</strong>
                                                <span>{selectedItem.carrera}</span>
                                            </div>
                                        </div>
                                    )}
                                    {'comuna' in selectedItem && selectedItem.comuna && (
                                        <div className="gu-detail-item">
                                            <FaMapMarkerAlt />
                                            <div>
                                                <strong>Comuna</strong>
                                                <span>{selectedItem.comuna}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="gu-detail-item">
                                        <FaCalendar />
                                        <div>
                                            <strong>Fecha de Registro</strong>
                                            <span>{formatDate(selectedItem.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {'intereses' in selectedItem && selectedItem.intereses && selectedItem.intereses.length > 0 && (
                                <div className="gu-detail-section">
                                    <h3>Áreas de Interés</h3>
                                    <div className="gu-interests">
                                        {selectedItem.intereses.map((interes, index) => (
                                            <span key={index} className="gu-interest-tag">
                                                <FaHeart style={{ marginRight: '6px' }} />
                                                {interes}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="gu-detail-section">
                                <h3>Estado de la Cuenta</h3>
                                <div className="gu-detail-grid">
                                    {'rol' in selectedItem ? (
                                        <>
                                            <div className="gu-detail-item">
                                                <FaUserCog />
                                                <div>
                                                    <strong>Rol</strong>
                                                    <span className={getRoleBadgeClass(selectedItem.rol)}>
                                                        {getRoleText(selectedItem.rol)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="gu-detail-item">
                                                {selectedItem.bloqueado ? <FaLock /> : <FaUnlock />}
                                                <div>
                                                    <strong>Estado</strong>
                                                    <span className={`gu-badge ${selectedItem.bloqueado ? 'gu-badge-rejected' : 'gu-badge-approved'}`}>
                                                        {selectedItem.bloqueado ? 'Bloqueado' : 'Activo'}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="gu-detail-item">
                                            <FaUser />
                                            <div>
                                                <strong>Estado de Solicitud</strong>
                                                <span className={getStatusBadgeClass(selectedItem.status)}>
                                                    {getStatusText(selectedItem.status)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {'reviewNotes' in selectedItem && selectedItem.reviewNotes && (
                                <div className="gu-detail-section">
                                    <h3>Notas de Revisión</h3>
                                    <p>{selectedItem.reviewNotes}</p>
                                </div>
                            )}
                        </div>
                        <div className="gu-modal-footer">
                            <button className="gu-btn gu-btn-secondary" onClick={() => setShowDetailModal(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Aprobar */}
            {showApproveModal && selectedItem && (
                <ConfirmModal
                    title="Aprobar Solicitud"
                    message={`¿Estás seguro de aprobar la solicitud de "${selectedItem.nombre}"? Se creará una cuenta de usuario y recibirá un correo de confirmación.`}
                    confirmText={actionLoading ? "Aprobando..." : "Aprobar"}
                    cancelText="Cancelar"
                    onConfirm={handleApprove}
                    onCancel={() => { setShowApproveModal(false); setSelectedItem(null); }}
                    variant="info"
                />
            )}

            {/* Modal Rechazar */}
            {showRejectModal && selectedItem && (
                <div className="gu-modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="gu-modal-header">
                            <h2>Rechazar Solicitud</h2>
                            <button className="gu-modal-close" onClick={() => setShowRejectModal(false)}>×</button>
                        </div>
                        <div className="gu-modal-body">
                            <p style={{ marginBottom: '16px' }}>
                                ¿Estás seguro de rechazar la solicitud de <strong>{selectedItem.nombre}</strong>?
                            </p>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                                    Motivo del rechazo (opcional):
                                </label>
                                <textarea
                                    value={rejectNotes}
                                    onChange={(e) => setRejectNotes(e.target.value)}
                                    placeholder="Escribe el motivo del rechazo..."
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="gu-modal-footer">
                            <button
                                className="gu-btn gu-btn-secondary"
                                onClick={() => { setShowRejectModal(false); setSelectedItem(null); setRejectNotes(""); }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="gu-btn gu-btn-danger"
                                onClick={handleReject}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Rechazando..." : "Rechazar Solicitud"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Cambiar Rol */}
            {showRoleModal && selectedItem && 'rol' in selectedItem && (
                <div className="gu-modal-overlay" onClick={() => setShowRoleModal(false)}>
                    <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="gu-modal-header">
                            <h2>Cambiar Rol de Usuario</h2>
                            <button className="gu-modal-close" onClick={() => setShowRoleModal(false)}>×</button>
                        </div>
                        <div className="gu-modal-body">
                            <p style={{ marginBottom: '16px' }}>
                                Cambiar rol de <strong>{selectedItem.nombre}</strong>
                            </p>
                            <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                                Rol actual: <span className={getRoleBadgeClass(selectedItem.rol)}>{getRoleText(selectedItem.rol)}</span>
                            </p>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                                    Nuevo rol:
                                </label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as 'estudiante' | 'staff' | 'admin')}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="estudiante">Estudiante (Voluntario)</option>
                                    <option value="staff">Staff (Coordinador)</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <div className="gu-modal-footer">
                            <button
                                className="gu-btn gu-btn-secondary"
                                onClick={() => { setShowRoleModal(false); setSelectedItem(null); }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="gu-btn gu-btn-success"
                                onClick={handleChangeRole}
                                disabled={actionLoading || newRole === (selectedItem as Usuario).rol}
                            >
                                {actionLoading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Bloquear/Desbloquear */}
            {showBlockModal && selectedItem && 'bloqueado' in selectedItem && (
                <ConfirmModal
                    title={(selectedItem as Usuario).bloqueado ? "Desbloquear Usuario" : "Bloquear Usuario"}
                    message={
                        (selectedItem as Usuario).bloqueado
                            ? `¿Deseas desbloquear a "${selectedItem.nombre}"? Podrá acceder nuevamente al sistema.`
                            : `¿Deseas bloquear a "${selectedItem.nombre}"? No podrá acceder al sistema hasta que sea desbloqueado.`
                    }
                    confirmText={actionLoading ? "Procesando..." : ((selectedItem as Usuario).bloqueado ? "Desbloquear" : "Bloquear")}
                    cancelText="Cancelar"
                    onConfirm={handleToggleBlock}
                    onCancel={() => { setShowBlockModal(false); setSelectedItem(null); }}
                    variant={(selectedItem as Usuario).bloqueado ? "info" : "danger"}
                />
            )}
        </div>
    );
}