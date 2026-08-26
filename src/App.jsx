import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

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

// Motif signature : étoile à huit branches (khatam), inspirée du zellige marocain
function ZelligeMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
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

function useCountdown(targetDate, targetTime) {
  const [left, setLeft] = useState(null)

  useEffect(() => {
    if (!targetDate) return
    const target = new Date(`${targetDate}T${targetTime || '00:00:00'}`)

    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0 })
        return
      }
      setLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      })
    }

    tick()
    const id = setInterval(tick, 60 * 1000)
    return () => clearInterval(id)
  }, [targetDate, targetTime])

  return left
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

  const countdown = useCountdown(settings?.wedding_date, settings?.wedding_time)

  if (loading) {
    return <div className="loading">Un instant, l'invitation se prépare&nbsp;…</div>
  }

  if (error) {
    return (
      <div className="empty-state">
        Impossible de charger l'invitation.
        <br />
        ({error})
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="empty-state">
        Aucune information de mariage trouvée pour le moment.
      </div>
    )
  }

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="eyebrow">Nous nous marions</div>
        <p className="initials">{settings.initials || `${settings.groom_name?.[0] || ''} & ${settings.bride_name?.[0] || ''}`}</p>
        <p className="names">
          {settings.groom_name} &amp; {settings.bride_name}
        </p>

        {settings.wedding_quote && <p className="quote">{settings.wedding_quote}</p>}

        {settings.wedding_date && (
          <div className="date-pill">{formatDate(settings.wedding_date)}</div>
        )}

        {countdown && (
          <div className="countdown">
            <div className="unit">
              <div className="value">{countdown.days}</div>
              <div className="label">jours</div>
            </div>
            <div className="unit">
              <div className="value">{countdown.hours}</div>
              <div className="label">heures</div>
            </div>
            <div className="unit">
              <div className="value">{countdown.minutes}</div>
              <div className="label">minutes</div>
            </div>
          </div>
        )}
      </section>

      <Divider />

      {/* MESSAGE */}
      {(settings.invitation_message || settings.couple_description) && (
        <section className="section">
          <p className="quote" style={{ margin: '0 auto', maxWidth: 480 }}>
            {settings.invitation_message || settings.couple_description}
          </p>
        </section>
      )}

      <Divider />

      {/* DÉTAILS */}
      <section className="section">
        <h2 className="heading">Le grand jour</h2>
        <p className="subheading">Retrouvez-nous pour célébrer ensemble</p>

        <div className="details-grid">
          <div className="detail-card">
            <div className="label">Date &amp; heure</div>
            <div className="value">{formatDate(settings.wedding_date)}</div>
            {settings.wedding_time && (
              <div className="sub">à {formatTime(settings.wedding_time)}</div>
            )}
          </div>

          {settings.venue_name && (
            <div className="detail-card">
              <div className="label">Lieu</div>
              <div className="value">{settings.venue_name}</div>
              {(settings.address || settings.city) && (
                <div className="sub">
                  {[settings.address, settings.city, settings.country].filter(Boolean).join(', ')}
                </div>
              )}
              {settings.maps_url && (
                <a className="maps-link" href={settings.maps_url} target="_blank" rel="noreferrer">
                  Voir sur la carte
                </a>
              )}
            </div>
          )}

          {settings.dress_code && (
            <div className="detail-card">
              <div className="label">Dress code</div>
              <div className="value">{settings.dress_code}</div>
            </div>
          )}
        </div>
      </section>

      {/* PROGRAMME */}
      {schedule.length > 0 && (
        <>
          <Divider />
          <section className="section">
            <h2 className="heading">Le déroulé</h2>
            <p className="subheading">Une journée à vivre ensemble</p>

            <div className="timeline">
              {schedule.map((item) => (
                <div className="timeline-item" key={item.id}>
                  <div className="time">{formatTime(item.time)}</div>
                  <div className="rail" />
                  <div>
                    <p className="title">{item.title}</p>
                    {item.description && <p className="desc">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <Divider />

      {/* FOOTER */}
      <footer className="footer">
        <p className="signoff">{settings.final_message || 'Avec amour, à très bientôt.'}</p>
        <p className="small">{settings.footer_text || `${settings.groom_name} & ${settings.bride_name}`}</p>
      </footer>
    </div>
  )
}
