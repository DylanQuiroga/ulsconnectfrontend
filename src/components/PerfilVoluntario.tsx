import React, { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import "./css/PerfilVoluntario.css";
import { useAuthStore } from "../stores/sessionStore";
import api from "../services/api";

const PerfilVoluntario: React.FC = () => {
    const { user, isLoading, fetchUser } = useAuthStore();

    // ✅ SOLO 3 PREFERENCIAS
    const FRONT_TO_BD: Record<string, string> = {
        "Infantil": "infantes",
        "Adulto mayor": "adultos-mayores",
        "Medio Ambiente": "medio-ambiente",
    };

    const BD_TO_FRONT: Record<string, string> = {
        "infantes": "Infantil",
        "adultos-mayores": "Adulto mayor",
        "medio-ambiente": "Medio Ambiente",
    };

    const preferences = ["Medio Ambiente", "Infantil", "Adulto mayor"];

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        interests: [] as string[],
    });

    const [originalForm, setOriginalForm] = useState(form);
    const [editing, setEditing] = useState(false);
    const [selectedPrefs, setSelectedPrefs] = useState(new Set<string>());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const loaded = {
                name: user.nombre,
                email: user.correoUniversitario,
                phone: user.telefono || "",
                interests: (user.intereses as string[]) || [],
            };

            setForm(loaded);
            setOriginalForm(loaded);

            // ✅ Mapear intereses de BD a frontend
            const mapped = new Set<string>();
            loaded.interests.forEach((i) => {
                const frontName = BD_TO_FRONT[i];
                if (frontName) mapped.add(frontName);
            });
            setSelectedPrefs(mapped);
        }
    }, [user]);

    if (isLoading) return <div className="pv-loading">Cargando perfil...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePref = (p: string) => {
        const next = new Set(selectedPrefs);
        next.has(p) ? next.delete(p) : next.add(p);
        setSelectedPrefs(next);
        setForm((prev) => ({
            ...prev,
            interests: Array.from(next),
        }));
    };

    const onSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setSaving(true);

        try {
            // ✅ Convertir preferencias a formato BD
            const prefsBD = Array.from(selectedPrefs).map((p) => FRONT_TO_BD[p]);

            const payload = {
                nombre: form.name,
                telefono: form.phone,
                intereses: prefsBD,
            };

            const res = await api.put('/profile', payload);

            if (res.data.success) {
                setOriginalForm(form);
                setEditing(false);
                setSuccessMsg('✅ Perfil actualizado correctamente');

                // ✅ Recargar datos del usuario
                await fetchUser();

                // Ocultar mensaje después de 3s
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (err: any) {
            console.error('Error al actualizar perfil:', err);
            setError(err.response?.data?.error || 'Error al actualizar perfil');
        } finally {
            setSaving(false);
        }
    };

    const onCancel = () => {
        setForm(originalForm);

        // ✅ Restaurar preferencias originales
        const mapped = new Set<string>();
        originalForm.interests.forEach((i) => {
            const frontName = BD_TO_FRONT[i];
            if (frontName) mapped.add(frontName);
        });
        setSelectedPrefs(mapped);

        setEditing(false);
        setError(null);
        setSuccessMsg(null);
    };

    return (
        <main className="pv-container">
            <header className="pv-header">
                <h1 className="pv-heading">Mi Perfil</h1>
                <div className="pv-user">
                    <h5 className="pv-username">{form.name}</h5>
                    <small className="text-muted">Voluntario de Souls ULS</small>
                </div>
            </header>

            {error && (
                <div className="pv-alert pv-alert-error" role="alert">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="pv-alert pv-alert-success" role="alert">
                    {successMsg}
                </div>
            )}

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
                                    disabled
                                    className="pv-input"
                                    title="El correo no se puede modificar"
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
                                    placeholder="+56 9 XXXX XXXX"
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
                                    <button
                                        type="button"
                                        className="pv-btn pv-btn-cancel"
                                        onClick={onCancel}
                                        disabled={saving}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="pv-btn pv-btn-save"
                                        disabled={saving}
                                    >
                                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </article>

                <article className="pv-card pv-prefs-card">
                    <div className="pv-prefs-head">
                        <div>
                            <h3 className="pv-title">Preferencias / Áreas de Interés</h3>
                            <p className="pv-sub">
                                Selecciona las causas que más te interesan.
                            </p>
                        </div>

                        {!editing && (
                            <button
                                type="button"
                                className="pv-link-edit"
                                onClick={() => setEditing(true)}
                            >
                                <FaPen /> Editar
                            </button>
                        )}
                    </div>

                    <div className="pv-badges">
                        {preferences.map((p) => {
                            const active = selectedPrefs.has(p);
                            return (
                                <button
                                    key={p}
                                    type="button"
                                    className={`pv-badge ${active ? "active" : ""}`}
                                    onClick={() => editing && togglePref(p)}
                                    disabled={!editing}
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
