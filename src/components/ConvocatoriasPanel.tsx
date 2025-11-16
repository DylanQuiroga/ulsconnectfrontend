import React, { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/ConvocatoriasPanel.css";

type Convocatoria = {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    excerpt: string;
    image?: string;
};

const sample: Convocatoria[] = [
    {
        id: "1",
        title: "Jornada de Reforestación",
        category: "Ambiental",
        date: "12 de Mayo, 2024",
        location: "Parque Metropolitano",
        excerpt:
            "Ayúdanos a plantar 500 árboles nativos para restaurar el ecosistema local y combatir el cambio climático.",
        image: "/images/reforestacion.jpg",
    },
    {
        id: "2",
        title: "Apoyo en Comedor Comunitario",
        category: "Social",
        date: "18 de Mayo, 2024",
        location: "Centro Comunitario Vida",
        excerpt:
            "Colabora sirviendo alimentos y compartiendo un momento agradable con personas en situación de vulnerabilidad.",
        image: "/images/comedor.jpg",
    },
    {
        id: "3",
        title: "Tutorías de Lectura para Niños",
        category: "Educativo",
        date: "25 de Mayo, 2024",
        location: "Biblioteca Pública Central",
        excerpt:
            "Fomenta el amor por la lectura ayudando a niños de primaria a mejorar su comprensión y fluidez lectora.",
        image: "/images/tutorias.jpg",
    },
    {
        id: "4",
        title: "Limpieza de Playa",
        category: "Ambiental",
        date: "02 de Junio, 2024",
        location: "Playa La Costa",
        excerpt:
            "Únete a la limpieza comunitaria para recolectar desechos y proteger la fauna marina.",
        image: "/images/playa.jpg",
    },
    {
        id: "5",
        title: "Apoyo en Centro de Salud",
        category: "Salud",
        date: "10 de Junio, 2024",
        location: "Centro de Salud Norte",
        excerpt:
            "Acompaña en actividades de prevención y apoyo logístico en jornadas de salud comunitaria.",
        image: "/images/salud.jpg",
    },
    {
        id: "6",
        title: "Talleres de Capacitación Laboral",
        category: "Social",
        date: "20 de Junio, 2024",
        location: "Sala Comunitaria",
        excerpt:
            "Imparte o apoya talleres prácticos para mejorar habilidades laborales en jóvenes.",
        image: "/images/taller.jpg",
    },
];

const ConvocatoriaCard: React.FC<{ item: Convocatoria }> = ({ item }) => {
    return (
        <article className="cv-card">
            <div className="cv-body">
                <span className="cv-badge">{item.category}</span>
                <h4 className="cv-title">{item.title}</h4>
                <p className="cv-excerpt">{item.excerpt}</p>

                <div className="cv-meta">
                    <div className="cv-meta-item"><FaCalendarAlt /> <span>{item.date}</span></div>
                    <div className="cv-meta-item"><FaMapMarkerAlt /> <span>{item.location}</span></div>
                </div>

                <div className="cv-actions">
                    <button className="cv-btn cv-btn-ghost">Detalles</button>
                    <button className="cv-btn cv-btn-primary">Inscribirme</button>
                </div>
            </div>
        </article>
    );
};

const ConvocatoriasPanel: React.FC = () => {
    const [items] = useState(sample);
    const [query, setQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [types, setTypes] = useState<{ [k: string]: boolean }>({
        Ambiental: false,
        Social: true,
        Educativo: false,
        Salud: false,
    });

    const toggleType = (t: string) => setTypes((s) => ({ ...s, [t]: !s[t] }));

    const filtered = items.filter((it) => {
        if (query && !`${it.title} ${it.excerpt}`.toLowerCase().includes(query.toLowerCase())) return false;
        const activeTypes = Object.entries(types).filter(([, v]) => v).map(([k]) => k);
        if (activeTypes.length && !activeTypes.includes(it.category)) return false;
        return true;
    });

    return (
        <main className="cv-container">
            <aside className="cv-sidebar">
                <h3>Filtros</h3>
                <label className="cv-label">
                    Buscar por palabra
                    <input
                        className="cv-input"
                        placeholder="Ej: Reforestación"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>

                <div className="cv-section">
                    <div className="cv-section-title">Fecha</div>
                    <Calendar
                        onChange={(value) => setSelectedDate(value as Date)}
                        value={selectedDate}
                        className="cv-calendar-widget"
                    />
                </div>

                <div className="cv-section">
                    <div className="cv-section-title">Tipo de Actividad</div>
                    {Object.keys(types).map((t) => (
                        <label key={t} className="cv-check">
                            <input type="checkbox" checked={!!types[t]} onChange={() => toggleType(t)} />
                            <span>{t}</span>
                        </label>
                    ))}
                </div>

                <button className="cv-apply">Aplicar Filtros</button>
            </aside>

            <section className="cv-main">
                <header className="cv-hero">
                    <h2>Encuentra tu Próxima Oportunidad</h2>
                    <p className="cv-sub">Explora las convocatorias activas y únete a una causa.</p>
                </header>

                <div className="cv-grid">
                    {filtered.map((it) => (
                        <ConvocatoriaCard item={it} key={it.id} />
                    ))}
                </div>

                <div className="cv-pagination">
                    <button
                        className="cv-page-btn"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        ‹
                    </button>
                    <div className="cv-pages">
                        <button
                            className={`cv-page ${currentPage === 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(1)}
                        >
                            1
                        </button>
                        <button
                            className={`cv-page ${currentPage === 2 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(2)}
                        >
                            2
                        </button>
                        <button
                            className={`cv-page ${currentPage === 3 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(3)}
                        >
                            3
                        </button>
                        <span className="cv-ellipsis">…</span>
                        <button
                            className={`cv-page ${currentPage === 8 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(8)}
                        >
                            8
                        </button>
                    </div>
                    <button
                        className="cv-page-btn"
                        onClick={() => setCurrentPage(Math.min(8, currentPage + 1))}
                        disabled={currentPage === 8}
                    >
                        ›
                    </button>
                </div>
            </section>
        </main>
    );
};

export default ConvocatoriasPanel;