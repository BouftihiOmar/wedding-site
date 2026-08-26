import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

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
      <header className="admin-header">
        <h1>Espace Administration</h1>
        <button className="admin-btn-ghost" onClick={handleLogout}>
          Se déconnecter
        </button>
      </header>

      <form className="admin-form" onSubmit={handleSave}>
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
