import { useEffect, useState, useRef } from 'react'
import { supabase } from './supabaseClient'
import ThemeInjector from './ThemeInjector'
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

// ======================================================
// SCROLL REVEAL
// ======================================================

function Reveal({ children, className = '' }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// ======================================================
// ZELLIGE
// ======================================================

function ZelligeMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
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

// ======================================================
// COUNTDOWN
// ======================================================

function useCountdown(targetDate, targetTime) {
  const [left, setLeft] = useState(null)

  useEffect(() => {
    if (!targetDate) {
      setLeft(null)
      return
    }

    const target = new Date(
      `${targetDate}T${targetTime || '00:00:00'}`
    )

    const tick = () => {
      const diff = target.getTime() - Date.now()

      if (diff <= 0) {
        setLeft({
          days: 0,
          hours: 0,
          minutes: 0,
        })
        return
      }

      setLeft({
        days: Math.floor(
          diff / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (diff / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (diff / (1000 * 60)) % 60
        ),
      })
    }

    tick()

    const id = setInterval(tick, 60 * 1000)

    return () => clearInterval(id)
  }, [targetDate, targetTime])

  return left
}

// ======================================================
// MAIN APP
// ======================================================

export default function App() {
  const [settings, setSettings] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // الباب
  const [gateOpen, setGateOpen] = useState(false)

  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {
    async function load() {
      const {
        data: settingsData,
        error: settingsError,
      } = await supabase
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
        const {
          data: scheduleData,
        } = await supabase
          .from('wedding_schedule')
          .select('*')
          .eq('wedding_id', settingsData.id)
          .order('order_index', {
            ascending: true,
          })

        setSchedule(scheduleData || [])
      }

      setSettings(settingsData)
      setLoading(false)
    }

    load()
  }, [])

  const countdown = useCountdown(
    settings?.wedding_date,
    settings?.wedding_time
  )

  // ====================================================
  // OPEN GATE
  // ====================================================

  const openGate = () => {
    setGateOpen(true)

    // نخلي scroll مقفول أثناء animation
    document.body.classList.add('gate-opening')

    setTimeout(() => {
      document.body.classList.remove('gate-opening')
    }, 1800)
  }

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="loading">
        Un instant, l'invitation se prépare&nbsp;…
      </div>
    )
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="empty-state">
        Impossible de charger l'invitation.
        <br />
        ({error})
      </div>
    )
  }

  // ====================================================
  // NO WEDDING
  // ====================================================

  if (!settings) {
    return (
      <div className="empty-state">
        Aucune information de mariage trouvée
        pour le moment.
      </div>
    )
  }

  return (
    <div className="page">

      {/* Applique les couleurs et vitesses d'animation
          choisies dans l'admin, en live */}
      <ThemeInjector settings={settings} />

      {/* ==================================================
          GRAND PORTAIL
          ================================================== */}

      <div
        className={`wedding-gate ${
          gateOpen ? 'gate-is-open' : ''
        }`}
      >

        {/* الخلفية */}
        <div className="gate-background">
          <div className="gate-glow" />
          <div className="gate-sparkles">
  <span /><span /><span /><span /><span /><span />
</div>
        </div>

        {/* عمودين مزخرفين على الجنبين */}
        <div className="gate-column left" />
        <div className="gate-column right" />

        {/* الباب اليسر */}
        <div className="gate-door gate-left">

          <div className="gate-pattern" />
          <div className="gate-filigree" />

          <div className="gate-arch" />

          <div className="gate-decoration top">
            <ZelligeMark />
          </div>

          <div className="gate-decoration bottom">
            <ZelligeMark />
          </div>

          <div className="gate-name">
            {settings.groom_name?.[0] || '✦'}
          </div>

        </div>

        {/* الباب الأيمن */}
        <div className="gate-door gate-right">

          <div className="gate-pattern" />
          <div className="gate-filigree" />

          <div className="gate-arch" />

          <div className="gate-decoration top">
            <ZelligeMark />
          </div>

          <div className="gate-decoration bottom">
            <ZelligeMark />
          </div>

          <div className="gate-name">
            {settings.bride_name?.[0] || '✦'}
          </div>

        </div>

        {/* اللوحة المزخرفة فوق الباب (بحال القوس المنقوش) */}
        <div className="gate-motif-panel">
          <div className="gate-filigree" />
          <div className="gate-motif-star">
            <ZelligeMark />
          </div>
        </div>

        {/* الأرضية العاكسة */}
        <div className="gate-floor" />

        {/* المحتوى فوق الباب */}
        <div className="gate-content">

          <div className="gate-small">
            Invitation de mariage
          </div>

          <div className="gate-initials">
            {settings.initials ||
              `${settings.groom_name?.[0] || ''} & ${settings.bride_name?.[0] || ''}`}
          </div>

          <div className="gate-names">
            {settings.groom_name}
            <span>&amp;</span>
            {settings.bride_name}
          </div>

          <div className="gate-date">
            {formatDate(settings.wedding_date)}
          </div>

          <button
            type="button"
            className="gate-open-button"
            onClick={openGate}
            aria-label="Ouvrir l'invitation"
          >
            <span className="button-icon">
              <ZelligeMark />
            </span>

            <span>
              Ouvrir l'invitation
            </span>

            <span className="button-arrow">
              ↓
            </span>
          </button>

          <div className="gate-hint">
            Touchez pour entrer
          </div>

        </div>

        {/* lumière أثناء الفتح */}
        <div className="gate-light" />

      </div>

      {/* ==================================================
          HERO
          ================================================== */}

      <section className="hero">

        <div className="eyebrow">
          Nous nous marions
        </div>

        <p className="initials">
          {settings.initials ||
            `${settings.groom_name?.[0] || ''} & ${settings.bride_name?.[0] || ''}`}
        </p>

        <p className="names">
          {settings.groom_name} &amp; {settings.bride_name}
        </p>

        {settings.wedding_quote && (
          <p className="quote">
            {settings.wedding_quote}
          </p>
        )}

        {settings.wedding_date && (
          <div className="date-pill">
            {formatDate(settings.wedding_date)}
          </div>
        )}

        {countdown && (
          <div className="countdown">

            <div className="unit">
              <div className="value">
                {countdown.days}
              </div>

              <div className="label">
                jours
              </div>
            </div>

            <div className="unit">
              <div className="value">
                {countdown.hours}
              </div>

              <div className="label">
                heures
              </div>
            </div>

            <div className="unit">
              <div className="value">
                {countdown.minutes}
              </div>

              <div className="label">
                minutes
              </div>
            </div>

          </div>
        )}

      </section>

      <Divider />

      {/* ==================================================
          MESSAGE
          ================================================== */}

      {(settings.invitation_message ||
        settings.couple_description) && (

        <Reveal>

          <section className="section">

            <p
              className="quote"
              style={{
                margin: '0 auto',
                maxWidth: 480,
              }}
            >
              {settings.invitation_message ||
                settings.couple_description}
            </p>

          </section>

        </Reveal>
      )}

      <Divider />

      {/* ==================================================
          DÉTAILS
          ================================================== */}

      <Reveal>

        <section className="section">

          <h2 className="heading">
            Le grand jour
          </h2>

          <p className="subheading">
            Retrouvez-nous pour célébrer ensemble
          </p>

          <div className="details-grid">

            {/* DATE */}

            <div className="detail-card">

              <div className="label">
                Date &amp; heure
              </div>

              <div className="value">
                {formatDate(settings.wedding_date)}
              </div>

              {settings.wedding_time && (
                <div className="sub">
                  à {formatTime(settings.wedding_time)}
                </div>
              )}

            </div>

            {/* LIEU */}

            {settings.venue_name && (

              <div className="detail-card">

                <div className="label">
                  Lieu
                </div>

                <div className="value">
                  {settings.venue_name}
                </div>

                {(settings.address ||
                  settings.city) && (

                  <div className="sub">

                    {[
                      settings.address,
                      settings.city,
                      settings.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}

                  </div>
                )}

                {settings.maps_url && (

                  <a
                    className="maps-link"
                    href={settings.maps_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir sur la carte
                  </a>

                )}

              </div>
            )}

            {/* DRESS CODE */}

            {settings.dress_code && (

              <div className="detail-card">

                <div className="label">
                  Dress code
                </div>

                <div className="value">
                  {settings.dress_code}
                </div>

              </div>

            )}

          </div>

        </section>

      </Reveal>

      {/* ==================================================
          PROGRAMME
          ================================================== */}

      {schedule.length > 0 && (

        <>
          <Divider />

          <Reveal>

            <section className="section">

              <h2 className="heading">
                Le déroulé
              </h2>

              <p className="subheading">
                Une journée à vivre ensemble
              </p>

              <div className="timeline">

                {schedule.map((item) => (

                  <div
                    className="timeline-item"
                    key={item.id}
                  >

                    <div className="time">
                      {formatTime(item.time)}
                    </div>

                    <div className="rail" />

                    <div>

                      <p className="title">
                        {item.title}
                      </p>

                      {item.description && (

                        <p className="desc">
                          {item.description}
                        </p>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </section>

          </Reveal>
        </>

      )}

      <Divider />

      {/* ==================================================
          FOOTER
          ================================================== */}

      <Reveal>

        <footer className="footer">

          <p className="signoff">
            {settings.final_message ||
              'Avec amour, à très bientôt.'}
          </p>

          <p className="small">
            {settings.footer_text ||
              `${settings.groom_name} & ${settings.bride_name}`}
          </p>

        </footer>

      </Reveal>

    </div>
  )
}
