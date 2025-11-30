import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaStar, FaCheckCircle } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/ConvocatoriasPanel.css";
import api from "../services/api";
import { useAuthStore } from "../stores/sessionStore";
import ActivityDetailModal from "./ActivityDetailModal"; // ✅ NUEVO

type Convocatoria = {
    id: string;
    title: string;
    category: string;
    date: string;
    dateObj: Date | null;
    location: string;
    excerpt: string;
    image?: string;
    recommended?: boolean;
    enrolled?: boolean;
    isClosed?: boolean;
    // ✅ NUEVO: Datos completos para el modal
    fullData?: any;
};

const ConvocatoriaCard: React.FC<{
    item: Convocatoria;
    onEnrollSuccess: (id: string) => void;
    onShowDetails: (item: Convocatoria) => void; // ✅ NUEVO
}> = ({ item, onEnrollSuccess, onShowDetails }) => {
    const [enrolling, setEnrolling] = useState(false);
    const { user } = useAuthStore();

    const handleEnroll = async () => {
        if (!user) {
            alert('Debes iniciar sesión para inscribirte');
            return;
        }

        if (!user.id) {
            console.error('Usuario sin ID:', user);
            alert('Error: No se pudo obtener tu información de usuario. Por favor, cierra sesión e inicia sesión nuevamente.');
            return;
        }

        setEnrolling(true);
        try {
            console.log('📤 Enviando inscripción a evento:', item.id);

            // Usar endpoint backend existente
            const res = await api.post(`/inscripciones/${item.id}`);

            console.log('✅ Respuesta:', res.data);

            if (res.data.success) {
                onEnrollSuccess(item.id);
                alert('¡Inscripción exitosa! Te hemos enviado un correo de confirmación.');
            }
        } catch (err: any) {
            console.error('❌ Error completo:', err);
            console.error('❌ Response data:', err.response?.data);

            const errorMsg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Error al inscribirse';

            if (errorMsg.includes('Ya estás inscrito')) {
                onEnrollSuccess(item.id);
                alert('Ya estás inscrito en esta actividad.');
            } else if (errorMsg.includes('ID de usuario requerido') || errorMsg.includes('No autenticado')) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                window.location.href = '/login';
            } else if (errorMsg.includes('convocatoria está cerrada')) {
                alert(`Esta convocatoria está cerrada. ${err.response?.data?.motivo || ''}`);
            } else {
                alert(`Error: ${errorMsg}`);
            }

            if (err.response?.data?.motivo) {
                console.log('ℹ️ Motivo:', err.response.data.motivo);
            }
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <article className={`cv-card ${item.recommended ? 'cv-card-recommended' : ''} ${item.enrolled ? 'cv-card-enrolled' : ''} ${item.isClosed ? 'cv-card-closed' : ''}`}>
            {item.recommended && (
                <div className="cv-recommended-badge">
                    <FaStar /> Recomendado para ti
                </div>
            )}
            {item.enrolled && (
                <div className="cv-enrolled-badge">
                    <FaCheckCircle /> Inscrito
                </div>
            )}
            {item.isClosed && (
                <div className="cv-closed-badge">
                    Convocatoria Cerrada
                </div>
            )}
            <div className="cv-body">
                <span className="cv-badge">{item.category}</span>
                <h3 className="cv-title">{item.title}</h3>
                <p className="cv-excerpt">{item.excerpt}</p>

                <div className="cv-meta">
                    <div className="cv-meta-item">
                        <FaCalendarAlt /> <span>{item.date}</span>
                    </div>
                    <div className="cv-meta-item">
                        <FaMapMarkerAlt /> <span>{item.location}</span>
                    </div>
                </div>

                <div className="cv-actions">
                    {/* ✅ MODIFICADO: Ahora abre el modal */}
                    <button
                        className="cv-btn cv-btn-ghost"
                        onClick={() => onShowDetails(item)}
                    >
                        Detalles
                    </button>
                    <button
                        className="cv-btn cv-btn-primary"
                        onClick={handleEnroll}
                        disabled={enrolling || !user || item.enrolled || item.isClosed}
                    >
                        {item.isClosed
                            ? 'Cerrada'
                            : item.enrolled
                                ? '✓ Inscrito'
                                : (enrolling ? 'Inscribiendo...' : 'Inscribirme')}
                    </button>
                </div>
            </div>
        </article>
    );
};

const ConvocatoriasPanel: React.FC = () => {
    const { user } = useAuthStore();
    const [items, setItems] = useState<Convocatoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    // ✅ NUEVO: Estado para el modal
    const [selectedActivity, setSelectedActivity] = useState<Convocatoria | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [types, setTypes] = useState<{ [k: string]: boolean }>({
        "Medio Ambiente": false,
        "Infantil": false,
        "Adulto mayor": false,
    });

    const INTEREST_TO_AREA: Record<string, string> = {
        "infantes": "Infantil",
        "adultos-mayores": "Adulto mayor",
        "medio-ambiente": "Medio Ambiente",
    };

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get('/events');

                if (res.data.success) {
                    const userInterests = user?.intereses || [];
                    const recommendedAreas = userInterests
                        .map((i: string) => INTEREST_TO_AREA[i])
                        .filter(Boolean);

                    let userEnrollments: string[] = [];
                    if (user?.id) {
                        try {
                            const enrollRes = await api.get(`/inscripciones/${user.id}/activas`);
                            if (enrollRes.data && (enrollRes.data.success || enrollRes.data.data)) {
                                // ✅ Normalizar la forma real de la respuesta y forzar string
                                const enrollData = (enrollRes.data.data ?? enrollRes.data.inscripciones ?? enrollRes.data) || [];
                                console.log('DEBUG enrollData shape:', enrollData);
                                userEnrollments = enrollData
                                    .map((e: any) => {
                                        // varios posibles caminos en el backend
                                        const candidate =
                                            e.idActividad?._id ??
                                            e.idActividad?._id?._id ??
                                            e.idActividad ??
                                            e.actividad?._id ??
                                            e.actividad ??
                                            e._id;
                                        return candidate ? String(candidate) : null;
                                    })
                                    .filter(Boolean);
                                console.log('DEBUG normalized userEnrollments:', userEnrollments);
                            }
                        } catch (err) {
                            console.error('Error al cargar inscripciones:', err);
                        }
                    }

                    const activities = res.data.data.map((act: any) => {
                        const dateObj = act.fechaInicio ? new Date(act.fechaInicio) : null;
                        return {
                            // ✅ Normalizar id como string
                            id: act._id ? String(act._id) : String(act.id ?? ''),
                            title: act.titulo,
                            category: act.area,
                            date: dateObj
                                ? dateObj.toLocaleDateString('es-CL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'Por definir',
                            dateObj: dateObj,
                            location: act.ubicacion
                                ? `${act.ubicacion.nombreLugar}, ${act.ubicacion.nombreComuna}`
                                : 'Por definir',
                            excerpt: act.descripcion?.substring(0, 150) + '...' || '',
                            image: act.imagenUrl || '',
                            recommended: recommendedAreas.includes(act.area),
                            enrolled: userEnrollments.includes(act._id ? String(act._id) : String(act.id ?? '')),
                            isClosed: act.estado === 'closed',
                            fullData: act,
                        };
                    });

                    activities.sort((a: Convocatoria, b: Convocatoria) =>
                        (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0)
                    );

                    setItems(activities);

                    if (recommendedAreas.length > 0) {
                        const initialTypes: { [k: string]: boolean } = {
                            "Medio Ambiente": false,
                            "Infantil": false,
                            "Adulto mayor": false,
                        };

                        recommendedAreas.forEach((area: string) => {
                            if (initialTypes.hasOwnProperty(area)) {
                                initialTypes[area] = true;
                            }
                        });

                        setTypes(initialTypes);
                    }
                }
            } catch (err: any) {
                console.error('Error al cargar actividades:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, [user]);

    const handleEnrollSuccess = (activityId: string) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === activityId ? { ...item, enrolled: true } : item
            )
        );
    };

    // ✅ NUEVO: Handlers para el modal
    const handleShowDetails = (item: Convocatoria) => {
        setSelectedActivity(item);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedActivity(null);
    };

    const handleModalEnrollSuccess = (activityId: string) => {
        handleEnrollSuccess(activityId);
    };

    const toggleType = (t: string) => setTypes((s) => ({ ...s, [t]: !s[t] }));

    const filtered = items.filter((it) => {
        if (query && !`${it.title} ${it.excerpt}`.toLowerCase().includes(query.toLowerCase())) {
            return false;
        }

        const activeTypes = Object.entries(types).filter(([, v]) => v).map(([k]) => k);
        if (activeTypes.length && !activeTypes.includes(it.category)) {
            return false;
        }

        if (selectedDate && it.dateObj) {
            const itemDate = new Date(it.dateObj.getFullYear(), it.dateObj.getMonth(), it.dateObj.getDate());
            const filterDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

            if (itemDate.getTime() !== filterDate.getTime()) {
                return false;
            }
        }

        return true;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filtered.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <div className="cv-loading">Cargando actividades...</div>;

    return (
        <main className="cv-container">
            <aside className="cv-sidebar">
                <h3>Filtros</h3>

                {user && user.intereses && user.intereses.length > 0 && (
                    <div className="cv-user-hint">
                        <p>✨ Mostrando actividades basadas en tus intereses</p>
                    </div>
                )}

                <label className="cv-label">
                    Buscar por palabra
                    <input
                        className="cv-input"
                        placeholder="Ej: Reforestación"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </label>

                <div className="cv-section">
                    <div className="cv-section-title">Fecha</div>
                    <Calendar
                        onChange={(value) => {
                            setSelectedDate(value as Date);
                            setCurrentPage(1);
                        }}
                        value={selectedDate}
                        className="cv-calendar-widget"
                    />
                    {selectedDate && (
                        <button
                            className="cv-clear-date"
                            onClick={() => {
                                setSelectedDate(null);
                                setCurrentPage(1);
                            }}
                        >
                            Limpiar fecha
                        </button>
                    )}
                </div>

                <div className="cv-section">
                    <div className="cv-section-title">Tipo de Actividad</div>
                    {Object.keys(types).map((t) => (
                        <label key={t} className="cv-check">
                            <input
                                type="checkbox"
                                checked={!!types[t]}
                                onChange={() => {
                                    toggleType(t);
                                    setCurrentPage(1);
                                }}
                            />
                            <span>{t}</span>
                        </label>
                    ))}
                </div>
            </aside>

            <section className="cv-main">
                <header className="cv-hero">
                    <h2>Encuentra tu Próxima Oportunidad</h2>
                    <p className="cv-sub">
                        Explora las convocatorias activas y únete a una causa.
                        {filtered.length > 0 && (
                            <span> ({filtered.length} resultado{filtered.length !== 1 ? 's' : ''})</span>
                        )}
                    </p>
                </header>

                {filtered.length === 0 ? (
                    <div className="cv-empty">
                        <p>No se encontraron convocatorias con los filtros aplicados.</p>
                        <button
                            className="cv-btn cv-btn-outline"
                            onClick={() => {
                                setQuery("");
                                setSelectedDate(null);
                                setTypes({
                                    "Medio Ambiente": false,
                                    "Infantil": false,
                                    "Adulto mayor": false,
                                });
                                setCurrentPage(1);
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cv-grid">
                            {currentItems.map((it) => (
                                <ConvocatoriaCard
                                    item={it}
                                    key={it.id}
                                    onEnrollSuccess={handleEnrollSuccess}
                                    onShowDetails={handleShowDetails} // ✅ NUEVO
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="cv-pagination">
                                <button
                                    className="cv-page-btn"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    ‹
                                </button>

                                <div className="cv-pages">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    className={`cv-page ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => goToPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="cv-ellipsis">…</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    className="cv-page-btn"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* ✅ NUEVO: Modal de detalles */}
            {showDetailModal && selectedActivity && selectedActivity.fullData && (
                <ActivityDetailModal
                    activity={{
                        _id: selectedActivity.id,
                        titulo: selectedActivity.fullData.titulo,
                        descripcion: selectedActivity.fullData.descripcion,
                        area: selectedActivity.fullData.area,
                        tipo: selectedActivity.fullData.tipo,
                        fechaInicio: selectedActivity.fullData.fechaInicio,
                        fechaTermino: selectedActivity.fullData.fechaTermino,
                        horaInicio: selectedActivity.fullData.horaInicio,
                        horaTermino: selectedActivity.fullData.horaTermino,
                        ubicacion: selectedActivity.fullData.ubicacion,
                        cuposDisponibles: selectedActivity.fullData.cuposDisponibles,
                        estado: selectedActivity.fullData.estado,
                        imagenUrl: selectedActivity.fullData.imagenUrl,
                        requisitos: selectedActivity.fullData.requisitos,
                        contacto: selectedActivity.fullData.contacto,
                        enrolled: selectedActivity.enrolled,
                        isClosed: selectedActivity.isClosed,
                    }}
                    onClose={handleCloseModal}
                    onEnrollSuccess={handleModalEnrollSuccess}
                />
            )}
        </main>
    );
};

export default ConvocatoriasPanel;