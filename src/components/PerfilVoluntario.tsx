import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';
import './css/PerfilVoluntario.css';

const PerfilVoluntario: React.FC = () => {
    const initial = {
        name: 'Alejandro Martínez',
        email: 'alejandro.martinez@email.com',
        phone: '+34 600 123 456',
    };

    const [form, setForm] = useState(initial);
    const [editing, setEditing] = useState(false);
    const preferences = ['Medio Ambiente', 'Infantil', 'Adulto mayor'];
    const [selectedPrefs, setSelectedPrefs] = useState(new Set(['Medio Ambiente', 'Bienestar Animal']));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePref = (p: string) => {
        const next = new Set(selectedPrefs);
        if (next.has(p)) next.delete(p); else next.add(p);
        setSelectedPrefs(next);
    };

    const onSave = (e?: React.FormEvent) => {
        e?.preventDefault();
        // TODO: llamar API para guardar
        setEditing(false);
    };

    const onCancel = () => {
        setForm(initial);
        setEditing(false);
    };

    return (
        <main className="pv-container">
            <header className="pv-header">
                <h1 className="pv-heading">Mi Perfil</h1>
                <div className="pv-user">
                    <h5 className="pv-username">{initial.name}</h5>
                    <small className="text-muted">Miembro desde Enero 2023</small>
                </div>
            </header>

            <section className="pv-grid">
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
                                <button type="button" className="pv-btn pv-btn-outline" onClick={() => setEditing(true)}>
                                    Editar
                                </button>
                            )}
                            {editing && (
                                <>
                                    <button type="button" className="pv-btn pv-btn-cancel" onClick={onCancel}>Cancelar</button>
                                    <button type="submit" className="pv-btn pv-btn-save">Guardar Cambios</button>
                                </>
                            )}
                        </div>
                    </form>
                </article>

                <article className="pv-card pv-prefs-card">
                    <div className="pv-prefs-head">
                        <div>
                            <h3 className="pv-title">Preferencias / Áreas de Interés</h3>
                            <p className="pv-sub">Selecciona las causas que más te interesan para recibir notificaciones sobre nuevas oportunidades.</p>
                        </div>
                        <button type="button" className="pv-link-edit" onClick={() => setEditing(true)}>
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
                                    onClick={() => togglePref(p)}
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