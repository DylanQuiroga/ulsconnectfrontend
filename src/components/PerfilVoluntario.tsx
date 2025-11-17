import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import './css/PerfilVoluntario.css';

const PerfilVoluntario: React.FC = () => {

    const FRONT_TO_BD: Record<string, string> = {
        "Infantil": "infantes",
        "Adulto mayor": "adultos-mayores",
        "Medio Ambiente": "medio-ambiente"
    };

    const preferences = ["Medio Ambiente", "Infantil", "Adulto mayor"];

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        interests: [] as string[],
    });

    const [originalForm, setOriginalForm] = useState(form);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Preferencias seleccionadas (frontend)
    const [selectedPrefs, setSelectedPrefs] = useState(new Set<string>());

    // ⬇ Obtener datos del usuario logueado
    useEffect(() => {
    fetch('https://apiulsconnect.leapcell.app/me', {
        method: 'GET',
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                const loaded = {
                    name: data.user.nombre,
                    email: data.user.correoUniversitario,
                    phone: data.user.telefono || '',
                    interests: data.user.intereses as string[] || [],
                };

                setForm(loaded);
                setOriginalForm(loaded);

                // 🔥 Mapear intereses del backend → frontend
                if (loaded.interests.length > 0) {
                    const mapped = new Set<string>();

                    loaded.interests.forEach(i => {
                        if (i === "infantes") mapped.add("Infantil");
                        if (i === "adultos-mayores") mapped.add("Adulto mayor");
                        if (i === "medio-ambiente") mapped.add("Medio Ambiente");
                    });

                    setSelectedPrefs(mapped);
                }
            }
            setLoading(false);
        })
        .catch(() => setLoading(false));
}, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePref = (p: string) => {
        const next = new Set(selectedPrefs);
        next.has(p) ? next.delete(p) : next.add(p);
        setSelectedPrefs(next);
        setForm(prev => ({
            ...prev,
            interests: Array.from(next)
        }));
    };

    const onSave = (e?: React.FormEvent) => {
        e?.preventDefault();

        // Convierte preferencias frontend → formato BD
        const prefsBD = Array.from(selectedPrefs).map(p => FRONT_TO_BD[p]);

        console.log("Guardando en BD:", prefsBD);

        // TODO: POST hacia /api/updateProfile

        setOriginalForm(form);
        setEditing(false);
    };

    const onCancel = () => {
        setForm(originalForm);
        setSelectedPrefs(new Set(originalForm.interests));
        setEditing(false);
    };

    if (loading) return <p>Cargando perfil...</p>;

    return (
        <main className="pv-container">
            <header className="pv-header">
                <h1 className="pv-heading">Mi Perfil</h1>
                <div className="pv-user">
                    <h5 className="pv-username">{form.name}</h5>
                    <small className="text-muted">Miembro desde Enero 2023</small>
                </div>
            </header>

            <section className="pv-grid">
                {/* INFORMACIÓN GENERAL */}
                <article className="pv-card">
                    <h3 className="pv-title">Información General</h3>

                    <form onSubmit={onSave} className="pv-form">
                        <div className="pv-row">
                            <label className="pv-col">
                                <span className="pv-label">Nombre</span>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="pv-input"
                                />
                            </label>

                            <label className="pv-col">
                                <span className="pv-label">Email</span>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="pv-input"
                                />
                            </label>
                        </div>

                        <div className="pv-row">
                            <label className="pv-col-full">
                                <span className="pv-label">Teléfono</span>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="pv-input"
                                />
                            </label>
                        </div>

                        <div className="pv-actions">
                            {!editing && (
                                <button
                                    type="button"
                                    className="pv-btn pv-btn-outline"
                                    onClick={() => setEditing(true)}
                                >
                                    Editar
                                </button>
                            )}

                            {editing && (
                                <>
                                    <button type="button" className="pv-btn pv-btn-cancel" onClick={onCancel}>
                                        Cancelar
                                    </button>

                                    <button type="submit" className="pv-btn pv-btn-save">
                                        Guardar Cambios
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </article>

                {/* PREFERENCIAS */}
                <article className="pv-card pv-prefs-card">
                    <div className="pv-prefs-head">
                        <div>
                            <h3 className="pv-title">Preferencias / Áreas de Interés</h3>
                            <p className="pv-sub">
                                Selecciona las causas que más te interesan.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="pv-link-edit"
                            onClick={() => setEditing(true)}
                        >
                            <FaPen /> Editar
                        </button>
                    </div>

                    <div className="pv-badges">
                        {preferences.map(p => {
                            const active = selectedPrefs.has(p);
                            return (
                                <button
                                    key={p}
                                    type="button"
                                    className={`pv-badge ${active ? 'active' : ''}`}
                                    onClick={() => editing && togglePref(p)}
                                    aria-pressed={active}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>
                </article>
            </section>
        </main>
    );
};

export default PerfilVoluntario;
