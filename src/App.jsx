import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import ThemeInjector from './ThemeInjector'
import WeddingGate from './WeddingGate'
import './app.css'

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

function ZelligeMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function Divider() {
  return (
    <div className="zellige-divider">
      <span className="line" />
      <ZelligeMark />
      <span className="line" />
    </div>
  )
}

export default function App() {
  const [settings, setSettings] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: settingsData, error: settingsError } = await supabase
        .from('wedding_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (settingsError) {
        setError(settingsError.message)
        setLoading(false)
        return
      }

      if (settingsData) {
        const { data: scheduleData } = await supabase
          .from('wedding_schedule')
          .select('*')
          .eq('wedding_id', settingsData.id)
          .order('order_index', { ascending: true })

        setSchedule(scheduleData || [])
      }

      setSettings(settingsData)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <div className="loading">Un instant, l'invitation se prépare…</div>
  if (error) return <div className="empty-state">Erreur: {error}</div>
  if (!settings) return <div className="empty-state">Aucune information trouvée.</div>

  return (
    <div className="page">
      <ThemeInjector settings={settings} />

      <WeddingGate 
        groomName={settings.groom_name}
        brideName={settings.bride_name}
        initials={settings.initials}
        date={formatDate(settings.wedding_date)}
      />

      <section className="hero">
        <div className="eyebrow">✦ Nous nous marions ✦</div>

        <h1 className="initials">
          {settings.initials || `${settings.groom_name?.[0] || ''} & ${settings.bride_name?.[0] || ''}`}
        </h1>

        <p className="names">
          {settings.groom_name} &amp; {settings.bride_name}
        </p>

        {settings.wedding_quote && (
          <p className="quote">{settings.wedding_quote}</p>
        )}

        {settings.wedding_date && (
          <div className="date-pill">
            {formatDate(settings.wedding_date)}
          </div>
        )}
      </section>

      <Divider />

      <section className="section">
        <h2 className="heading">Le grand jour</h2>
        <p className="subheading">Retrouvez-nous pour célébrer ensemble</p>

        <div className="details-grid">
          <div className="detail-card">
            <div className="label">Date &amp; Heure</div>
            <div className="value">{formatDate(settings.wedding_date)}</div>
            {settings.wedding_time && <div className="sub">à {formatTime(settings.wedding_time)}</div>}
          </div>

          {settings.venue_name && (
            <div className="detail-card">
              <div className="label">Lieu</div>
              <div className="value">{settings.venue_name}</div>
              <div className="sub">
                {[settings.address, settings.city].filter(Boolean).join(', ')}
              </div>
              {settings.maps_url && (
                <a className="maps-link" href={settings.maps_url} target="_blank" rel="noreferrer">
                  Voir sur la carte
                </a>
              )}
            </div>
          )}

          {settings.dress_code && (
            <div className="detail-card">
              <div className="label">Dress Code</div>
              <div className="value">{settings.dress_code}</div>
            </div>
          )}
        </div>
      </section>

      {schedule.length > 0 && (
        <>
          <Divider />
          <section className="section">
            <h2 className="heading">Programme</h2>
            <p className="subheading">Déroulement de la soirée</p>

            <div className="timeline">
              {schedule.map((item) => (
                <div className="timeline-item" key={item.id}>
                  <div className="time">{formatTime(item.time)}</div>
                  <div className="rail" />
                  <div>
                    <div className="title">{item.title}</div>
                    {item.description && <div className="desc">{item.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <Divider />

      <footer className="footer">
        <p className="signoff">{settings.final_message || 'Au plaisir de vous compter parmi nous.'}</p>
      </footer>
    </div>
  )
}
