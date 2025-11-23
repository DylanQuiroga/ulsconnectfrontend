import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/ConvocatoriasPanel.css";
import api from "../services/api";
import { useAuthStore } from "../stores/sessionStore";

type Convocatoria = {
    id: string;
    title: string;
    category: string;
    date: string;
    dateObj: Date | null; // ✅ Para filtrar por fecha
    location: string;
    excerpt: string;
    image?: string;
    recommended?: boolean;
};

const ConvocatoriaCard: React.FC<{ item: Convocatoria }> = ({ item }) => {
    const [enrolling, setEnrolling] = useState(false);
    const { user } = useAuthStore();

    const handleEnroll = async () => {
        if (!user) {
            alert('Debes iniciar sesión para inscribirte');
            return;
        }

        setEnrolling(true);
        try {
            const res = await api.post(`/events/${item.id}/enroll`);

            if (res.data.success) {
                alert('¡Inscripción exitosa!');
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Error al inscribirse';
            alert(errorMsg);

            if (err.response?.data?.motivo) {
                console.log('Motivo de cierre:', err.response.data.motivo);
            }
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <article className={`cv-card ${item.recommended ? 'cv-card-recommended' : ''}`}>
            {item.recommended && (
                <div className="cv-recommended-badge">
                    <FaStar /> Recomendado para ti
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
                    <button className="cv-btn cv-btn-ghost">Detalles</button>
                    <button
                        className="cv-btn cv-btn-primary"
                        onClick={handleEnroll}
                        disabled={enrolling || !user}
                    >
                        {enrolling ? 'Inscribiendo...' : 'Inscribirme'}
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
    const ITEMS_PER_PAGE = 9; // ✅ Items por página

    // ✅ SOLO 3 FILTROS
    const [types, setTypes] = useState<{ [k: string]: boolean }>({
        "Medio Ambiente": false,
        "Infantil": false,
        "Adulto mayor": false,
    });

    // ✅ Mapeo de intereses del usuario a áreas de actividades
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
                    // ✅ Obtener áreas recomendadas del usuario (desde el login)
                    const userInterests = user?.intereses || [];
                    const recommendedAreas = userInterests
                        .map((i: string) => INTEREST_TO_AREA[i])
                        .filter(Boolean);

                    const activities = res.data.data.map((act: any) => {
                        const dateObj = act.fechaInicio ? new Date(act.fechaInicio) : null;
                        return {
                            id: act._id,
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
                            excerpt: act.descripcion || '',
                            image: act.imagenUrl || '',
                            recommended: recommendedAreas.includes(act.area),
                        };
                    });

                    // ✅ Ordenar: recomendados primero
                    activities.sort((a: Convocatoria, b: Convocatoria) =>
                        (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0)
                    );

                    setItems(activities);

                    // ✅ Pre-seleccionar filtros según intereses del usuario (desde login)
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

    const toggleType = (t: string) => setTypes((s) => ({ ...s, [t]: !s[t] }));

    // ✅ Filtrado funcional (búsqueda, tipo, fecha)
    const filtered = items.filter((it) => {
        // Filtro por texto
        if (query && !`${it.title} ${it.excerpt}`.toLowerCase().includes(query.toLowerCase())) {
            return false;
        }

        // Filtro por tipo
        const activeTypes = Object.entries(types).filter(([, v]) => v).map(([k]) => k);
        if (activeTypes.length && !activeTypes.includes(it.category)) {
            return false;
        }

        // ✅ Filtro por fecha (si hay fecha seleccionada)
        if (selectedDate && it.dateObj) {
            const itemDate = new Date(it.dateObj.getFullYear(), it.dateObj.getMonth(), it.dateObj.getDate());
            const filterDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

            if (itemDate.getTime() !== filterDate.getTime()) {
                return false;
            }
        }

        return true;
    });

    // ✅ Paginación funcional
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filtered.slice(startIndex, endIndex);

    // ✅ Cambiar de página
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
                            setCurrentPage(1); // ✅ Reiniciar paginación
                        }}
                    />
                </label>

                <div className="cv-section">
                    <div className="cv-section-title">Fecha</div>
                    <Calendar
                        onChange={(value) => {
                            setSelectedDate(value as Date);
                            setCurrentPage(1); // ✅ Reiniciar paginación
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
                                    setCurrentPage(1); // ✅ Reiniciar paginación
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
                                <ConvocatoriaCard item={it} key={it.id} />
                            ))}
                        </div>

                        {/* ✅ Paginación funcional */}
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
                                        // Mostrar solo páginas relevantes
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
        </main>
    );
};

export default ConvocatoriasPanel;