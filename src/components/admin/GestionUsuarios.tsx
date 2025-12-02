import React, { useEffect, useState, useMemo } from "react";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaCalendar, FaCheck, FaTimes, FaEye, FaEyeSlash, FaUserCog, FaLock, FaUnlock, FaUsers, FaHeart, FaUserPlus, FaKey, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { adminService, RegistrationRequest, Usuario, CreateUserData } from "../../services/adminService";
import ConfirmModal from "./ConfirmModal";
import careersData from "../../data/careers.json";
import "./css/GestionUsuarios.css";

type TabType = 'solicitudes' | 'usuarios';
type FilterType = 'all' | 'pending' | 'approved' | 'rejected';
type UserFilterType = 'all' | 'estudiante' | 'staff' | 'admin' | 'blocked';

export default function GestionUsuarios() {
    // Tab actual
    const [activeTab, setActiveTab] = useState<TabType>('solicitudes');

    // Solicitudes de registro
    const [allSolicitudes, setAllSolicitudes] = useState<RegistrationRequest[]>([]);
    const [solicitudes, setSolicitudes] = useState<RegistrationRequest[]>([]);
    const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
    const [solicitudFilter, setSolicitudFilter] = useState<FilterType>('all');

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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rejectNotes, setRejectNotes] = useState("");
    const [newRole, setNewRole] = useState<'estudiante' | 'staff' | 'admin'>('estudiante');

    // Formulario crear usuario
    const [createForm, setCreateForm] = useState<CreateUserData>({
        correoUniversitario: '',
        nombre: '',
        contrasena: '',
        rol: 'staff',
        telefono: '',
        carrera: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

    // Estado de acciones
    const [actionLoading, setActionLoading] = useState(false);

    // Paginación
    const [currentPageSolicitudes, setCurrentPageSolicitudes] = useState(1);
    const [currentPageUsuarios, setCurrentPageUsuarios] = useState(1);
    const itemsPerPage = 10;

    // Cargar datos iniciales
    useEffect(() => {
        if (activeTab === 'solicitudes') {
            fetchAllSolicitudes();
        } else {
            fetchUsuarios();
        }
    }, [activeTab]);

    // Resetear página cuando cambia el filtro o búsqueda
    useEffect(() => {
        setCurrentPageSolicitudes(1);
    }, [solicitudFilter, searchTerm]);

    useEffect(() => {
        setCurrentPageUsuarios(1);
    }, [userFilter, searchTerm]);

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
            const data = await adminService.getRegistrationRequests();
            setAllSolicitudes(Array.isArray(data) ? data : []);

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
            await adminService.approveRegistration(getUserId(selectedItem));
            alert("Solicitud aprobada exitosamente. El usuario recibirá un correo de confirmación.");
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
            await adminService.rejectRegistration(getUserId(selectedItem), rejectNotes);
            alert("Solicitud rechazada");
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
            await adminService.updateUserRole(getUserId(selectedItem), newRole);
            alert(`Rol actualizado a ${newRole}`);
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
            await adminService.toggleUserBlock(getUserId(usuario), !usuario.bloqueado);
            alert(usuario.bloqueado ? "Usuario desbloqueado" : "Usuario bloqueado");
            setShowBlockModal(false);
            setSelectedItem(null);
            fetchUsuarios();
        } catch (err: any) {
            alert("Error: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    // ============== CREAR STAFF/ADMIN ==============
    const validateCreateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!createForm.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }

        if (!createForm.correoUniversitario.trim()) {
            errors.correoUniversitario = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.correoUniversitario)) {
            errors.correoUniversitario = 'El correo no tiene un formato válido';
        }

        if (!createForm.contrasena) {
            errors.contrasena = 'La contraseña es requerida';
        } else if (createForm.contrasena.length < 6) {
            errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!createForm.telefono?.trim()) {
            errors.telefono = 'El teléfono es requerido';
        }

        if (!createForm.carrera?.trim()) {
            errors.carrera = 'La carrera/departamento es requerida';
        }

        setCreateErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateUser = async () => {
        if (!validateCreateForm()) return;

        setActionLoading(true);
        try {
            const response = await adminService.createStaffOrAdmin(createForm);
            alert(`${response.message}`);
            setShowCreateModal(false);
            resetCreateForm();
            fetchUsuarios();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message;
            alert("Error: " + errorMsg);
        } finally {
            setActionLoading(false);
        }
    };

    const resetCreateForm = () => {
        setCreateForm({
            correoUniversitario: '',
            nombre: '',
            contrasena: '',
            rol: 'staff',
            telefono: '',
            carrera: ''
        });
        setCreateErrors({});
        setShowPassword(false);
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCreateForm({ ...createForm, contrasena: password });
        setShowPassword(true);
    };

    // ============== HELPERS ==============

    // Helper para obtener el ID del usuario (backend puede devolver 'id' o '_id')
    const getUserId = (user: Usuario | RegistrationRequest): string => {
        return (user as any).id || user._id || '';
    };

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

    // Paginación - calcular datos paginados
    const totalPagesSolicitudes = Math.ceil(filteredSolicitudes.length / itemsPerPage);
    const totalPagesUsuarios = Math.ceil(filteredUsuarios.length / itemsPerPage);

    const paginatedSolicitudes = useMemo(() => {
        const startIndex = (currentPageSolicitudes - 1) * itemsPerPage;
        return filteredSolicitudes.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSolicitudes, currentPageSolicitudes, itemsPerPage]);

    const paginatedUsuarios = useMemo(() => {
        const startIndex = (currentPageUsuarios - 1) * itemsPerPage;
        return filteredUsuarios.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsuarios, currentPageUsuarios, itemsPerPage]);

    // Componente de paginación reutilizable
    const Pagination = ({
        currentPage,
        totalPages,
        onPageChange,
        totalItems
    }: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        totalItems: number;
    }) => {
        if (totalPages <= 1) return null;

        const getPageNumbers = () => {
            const pages: (number | string)[] = [];
            const maxVisible = 5;

            if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                }
            }
            return pages;
        };

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        return (
            <div className="gu-pagination">
                <div className="gu-pagination-info">
                    Mostrando {startItem}-{endItem} de {totalItems} registros
                </div>
                <div className="gu-pagination-controls">
                    <button
                        className="gu-pagination-btn"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </button>

                    {getPageNumbers().map((page, index) => (
                        typeof page === 'number' ? (
                            <button
                                key={index}
                                className={`gu-pagination-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={index} className="gu-pagination-ellipsis">{page}</span>
                        )
                    ))}

                    <button
                        className="gu-pagination-btn"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        );
    };

    // Stats
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
                        {activeTab === 'solicitudes' ? 'Solicitudes de Registro' : 'Gestión de Usuarios'}
                    </h1>
                    <p className="gu-subtitle">
                        {activeTab === 'solicitudes'
                            ? 'Revisa y aprueba las solicitudes de nuevos voluntarios'
                            : 'Administra los usuarios del sistema'}
                    </p>
                </div>
                <div className="gu-stats">
                    {activeTab === 'usuarios' && (
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

            {/* Tabs y botón crear */}
            <div className="gu-controls">
                <div className="gu-filters" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className={`gu-filter-btn ${activeTab === 'solicitudes' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('solicitudes'); setSearchTerm(''); }}
                        >
                            Solicitudes
                        </button>
                        <button
                            className={`gu-filter-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('usuarios'); setSearchTerm(''); }}
                        >
                            Usuarios
                        </button>
                    </div>

                    {/* Botón crear Staff/Admin - solo visible en tab usuarios */}
                    {activeTab === 'usuarios' && (
                        <button
                            className="gu-btn gu-btn-success"
                            onClick={() => setShowCreateModal(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaUserPlus /> Crear Staff/Admin
                        </button>
                    )}
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
                            {/* Filtros de solicitudes eliminados para mostrar todas por defecto */}
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
                                        ? '¡No hay solicitudes pendientes!'
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
                                    {paginatedSolicitudes.map((sol) => (
                                        <tr key={getUserId(sol)}>
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
                            <Pagination
                                currentPage={currentPageSolicitudes}
                                totalPages={totalPagesSolicitudes}
                                onPageChange={setCurrentPageSolicitudes}
                                totalItems={filteredSolicitudes.length}
                            />
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
                                    {paginatedUsuarios.map((user) => (
                                        <tr key={getUserId(user)} style={user.bloqueado ? { backgroundColor: '#fef2f2' } : {}}>
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
                            <Pagination
                                currentPage={currentPageUsuarios}
                                totalPages={totalPagesUsuarios}
                                onPageChange={setCurrentPageUsuarios}
                                totalItems={filteredUsuarios.length}
                            />
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
                                            <span>{selectedItem.createdAt ? formatDate(selectedItem.createdAt) : '-'}</span>
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

            {/* ============== MODAL CREAR STAFF/ADMIN ============== */}
            {showCreateModal && (
                <div className="gu-modal-overlay">
                    <div className="gu-modal">
                        <div className="gu-modal-header">
                            <h2>
                                <FaUserPlus />
                                Crear Staff/Admin
                            </h2>
                            <button className="gu-modal-close" onClick={() => { setShowCreateModal(false); resetCreateForm(); }}>×</button>
                        </div>
                        <div className="gu-modal-body">
                            <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '0.95rem' }}>
                                Crea una cuenta con privilegios de Staff o Administrador. El usuario podrá iniciar sesión inmediatamente.
                            </p>

                            {/* Nombre */}
                            <div className="gu-form-group">
                                <label className="gu-form-label">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    value={createForm.nombre}
                                    onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
                                    placeholder="Ej: Juan Pérez González"
                                    className={createErrors.nombre ? 'error' : ''}
                                />
                                {createErrors.nombre && (
                                    <span className="gu-form-error">{createErrors.nombre}</span>
                                )}
                            </div>

                            {/* Correo */}
                            <div className="gu-form-group">
                                <label className="gu-form-label">
                                    Correo electrónico *
                                </label>
                                <input
                                    type="email"
                                    value={createForm.correoUniversitario}
                                    onChange={(e) => setCreateForm({ ...createForm, correoUniversitario: e.target.value })}
                                    placeholder="correo@ejemplo.com"
                                    className={createErrors.correoUniversitario ? 'error' : ''}
                                />
                                {createErrors.correoUniversitario && (
                                    <span className="gu-form-error">{createErrors.correoUniversitario}</span>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div className="gu-form-group">
                                <label className="gu-form-label">
                                    Contraseña *
                                </label>
                                <div className="gu-password-container">
                                    <div className="gu-password-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={createForm.contrasena}
                                            onChange={(e) => setCreateForm({ ...createForm, contrasena: e.target.value })}
                                            placeholder="Mínimo 6 caracteres"
                                            className={createErrors.contrasena ? 'error' : ''}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="gu-password-toggle"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateRandomPassword}
                                        className="gu-btn gu-btn-secondary"
                                        style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        title="Generar contraseña aleatoria"
                                    >
                                        <FaKey /> Generar
                                    </button>
                                </div>
                                {createErrors.contrasena && (
                                    <span className="gu-form-error">{createErrors.contrasena}</span>
                                )}
                                {createForm.contrasena && showPassword && (
                                    <div className="gu-warning-box">
                                        Guarda esta contraseña y compártela de forma segura con el usuario.
                                    </div>
                                )}
                            </div>

                            {/* Rol */}
                            <div className="gu-form-group">
                                <label className="gu-form-label">
                                    Rol *
                                </label>
                                <select
                                    value={createForm.rol}
                                    onChange={(e) => setCreateForm({ ...createForm, rol: e.target.value as 'staff' | 'admin' })}
                                >
                                    <option value="staff">Staff (Coordinador)</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                <span className="gu-form-hint">
                                    {createForm.rol === 'admin'
                                        ? 'Acceso total al sistema: gestión de usuarios, actividades y configuraciones.'
                                        : 'Puede crear y gestionar actividades, tomar asistencia y ver reportes.'}
                                </span>
                            </div>

                            {/* Teléfono */}
                            <div className="gu-form-group">
                                <label className="gu-form-label">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    value={createForm.telefono}
                                    onChange={(e) => setCreateForm({ ...createForm, telefono: e.target.value })}
                                    placeholder="+56 9 1234 5678"
                                    className={createErrors.telefono ? 'error' : ''}
                                />
                                {createErrors.telefono && (
                                    <span className="gu-form-error">{createErrors.telefono}</span>
                                )}
                            </div>

                            {/* Carrera/Departamento */}
                            <div className="gu-form-group">
                                <label className="gu-form-label">
                                    Carrera
                                </label>
                                <select
                                    value={createForm.carrera}
                                    onChange={(e) => setCreateForm({ ...createForm, carrera: e.target.value })}
                                    className={createErrors.carrera ? 'error' : ''}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {careersData.careers.map((career) => (
                                        <option key={career.value} value={career.label}>
                                            {career.label}
                                        </option>
                                    ))}
                                </select>
                                {createErrors.carrera && (
                                    <span className="gu-form-error">{createErrors.carrera}</span>
                                )}
                            </div>
                        </div>
                        <div className="gu-modal-footer">
                            <button
                                className="gu-btn gu-btn-secondary"
                                onClick={() => { setShowCreateModal(false); resetCreateForm(); }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="gu-btn gu-btn-success"
                                onClick={handleCreateUser}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>Creando...</>
                                ) : (
                                    <>
                                        <FaUserPlus /> Crear Usuario
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}