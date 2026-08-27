import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import ThemeInjector from './ThemeInjector'

const COLOR_FIELDS = [
  { key: 'color_bg', label: 'Fond général (background)' },
  { key: 'color_bg_deep', label: 'Fond dégradé (footer)' },
  { key: 'color_emerald', label: 'Couleur principale (titres, boutons)' },
  { key: 'color_gold', label: 'Doré (accents, motifs)' },
  { key: 'color_gold_soft', label: 'Doré clair (bordures)' },
  { key: 'color_gold_light', label: 'Doré très clair' },
  { key: 'color_clay', label: 'Terracotta (labels)' },
  { key: 'color_ink', label: 'Texte principal' },
  { key: 'color_ink_soft', label: 'Texte secondaire' },
  { key: 'color_door_dark', label: 'Porte — teinte foncée' },
  { key: 'color_door_light', label: 'Porte — teinte claire' },
]

const SPEED_FIELDS = [
  { key: 'anim_door_speed', label: "Vitesse d'ouverture de la porte (secondes)", min: 0.3, max: 4, step: 0.1 },
  { key: 'anim_reveal_speed', label: 'Vitesse des animations de la page (secondes)', min: 0.2, max: 3, step: 0.1 },
  { key: 'anim_glow_speed', label: 'Vitesse de la lueur derrière la porte (secondes)', min: 1, max: 10, step: 0.5 },
]

function LoginForm({ onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError('Email ou mot de passe incorrect.')
      return
    }

    onLoggedIn()
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1 className="admin-login-title">Espace Administration</h1>
        <p className="admin-login-sub">Connectez-vous pour gérer votre invitation</p>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="admin-field">
          <span>Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="admin-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}

function Dashboard() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('wedding_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error) setError(error.message)
      setSettings(data)
      setLoading(false)
    }
    load()
  }, [])

  function update(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    setError(null)

    const { id, created_at, updated_at, ...fields } = settings

    const { error } = await supabase
      .from('wedding_settings')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setSavedAt(new Date())
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return <div className="admin-loading">Chargement…</div>
  }

  if (!settings) {
    return <div className="admin-loading">Aucune donnée trouvée.</div>
  }

  return (
    <div className="admin-shell">
      {/* Aperçu live : applique les couleurs/vitesses pendant qu'on les modifie */}
      <ThemeInjector settings={settings} />

      <header className="admin-header">
        <h1>Espace Administration</h1>
        <button className="admin-btn-ghost" onClick={handleLogout}>
          Se déconnecter
        </button>
      </header>

      <form className="admin-form" onSubmit={handleSave}>
        <section className="admin-section">
          <h2>Personnalisation — Couleurs</h2>
          <div className="admin-grid">
            {COLOR_FIELDS.map(({ key, label }) => (
              <label className="admin-field" key={key}>
                <span>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="color"
                    value={settings[key] || '#ffffff'}
                    onChange={(e) => update(key, e.target.value)}
                    style={{
                      width: 42,
                      height: 36,
                      padding: 2,
                      border: '1px solid var(--color-gold-soft)',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  />
                  <input
                    type="text"
                    value={settings[key] || ''}
                    onChange={(e) => update(key, e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <h2>Personnalisation — Animations</h2>
          <div className="admin-grid">
            {SPEED_FIELDS.map(({ key, label, min, max, step }) => (
              <label className="admin-field admin-field-wide" key={key}>
                <span>{label} — {settings[key]}s</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={settings[key] ?? min}
                  onChange={(e) => update(key, parseFloat(e.target.value))}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <h2>Le couple</h2>
          <div className="admin-grid">
            <label className="admin-field">
              <span>Prénom du marié</span>
              <input value={settings.groom_name || ''} onChange={(e) => update('groom_name', e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Prénom de la mariée</span>
              <input value={settings.bride_name || ''} onChange={(e) => update('bride_name', e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Initiales</span>
              <input value={settings.initials || ''} onChange={(e) => update('initials', e.target.value)} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Citation / phrase d'accueil</span>
              <input value={settings.wedding_quote || ''} onChange={(e) => update('wedding_quote', e.target.value)} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Message d'invitation</span>
              <textarea
                value={settings.invitation_message || ''}
                onChange={(e) => update('invitation_message', e.target.value)}
                rows={3}
              />
            </label>
          </div>
        </section>

        <section className="admin-section">
          <h2>Détails du mariage</h2>
          <div className="admin-grid">
            <label className="admin-field">
              <span>Date</span>
              <input type="date" value={settings.wedding_date || ''} onChange={(e) => update('wedding_date', e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Heure</span>
              <input type="time" value={settings.wedding_time || ''} onChange={(e) => update('wedding_time', e.target.value)} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Lieu</span>
              <input value={settings.venue_name || ''} onChange={(e) => update('venue_name', e.target.value)} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Adresse</span>
              <input value={settings.address || ''} onChange={(e) => update('address', e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Ville</span>
              <input value={settings.city || ''} onChange={(e) => update('city', e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Pays</span>
              <input value={settings.country || ''} onChange={(e) => update('country', e.target.value)} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Lien Google Maps</span>
              <input value={settings.maps_url || ''} onChange={(e) => update('maps_url', e.target.value)} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Dress code</span>
              <input value={settings.dress_code || ''} onChange={(e) => update('dress_code', e.target.value)} />
            </label>
          </div>
        </section>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button className="admin-btn-primary" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {savedAt && (
            <span className="admin-saved">
              Enregistré à {savedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return <div className="admin-loading">Chargement…</div>
  }

  if (!session) {
    return <LoginForm onLoggedIn={() => {}} />
  }

  return <Dashboard />
}
