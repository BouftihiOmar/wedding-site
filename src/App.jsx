import { useEffect, useState, useRef } from 'react'
import { supabase } from './supabaseClient'

const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

/* =========================================================
   DATE
   ========================================================= */

function formatDate(dateStr) {
  if (!dateStr) return ''

  const d = new Date(`${dateStr}T00:00:00`)

  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`
}

function formatTime(timeStr) {
  if (!timeStr) return ''

  return timeStr.slice(0, 5)
}

/* =========================================================
   SCROLL REVEAL
   Compatible Android / iPhone / PC
   ========================================================= */

function Reveal({ children, className = '' }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    // Fallback pour anciens navigateurs
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

/* =========================================================
   ROYAL GATE
   Porte royale marocaine
   ========================================================= */

function RoyalGate() {
  return (
    <div
      className="royal-gate"
      aria-hidden="true"
    >

      {/* Atmospheric mist */}
      <div className="gate-atmosphere">

        <span className="mist mist-1" />
        <span className="mist mist-2" />
        <span className="mist mist-3" />

      </div>

      {/* Background glow */}
      <div className="gate-glow" />

      {/* LEFT DOOR */}
      <div className="gate-left">

        <div className="gate-arch">

          <div className="gate-pattern">

            <span className="pattern-star pattern-star-1">
              ✦
            </span>

            <span className="pattern-star pattern-star-2">
              ✦
            </span>

            <span className="pattern-star pattern-star-3">
              ✦
            </span>

          </div>

          <div className="gate-handle">
            <span />
          </div>

        </div>

      </div>

      {/* RIGHT DOOR */}
      <div className="gate-right">

        <div className="gate-arch">

          <div className="gate-pattern">

            <span className="pattern-star pattern-star-1">
              ✦
            </span>

            <span className="pattern-star pattern-star-2">
              ✦
            </span>

            <span className="pattern-star pattern-star-3">
              ✦
            </span>

          </div>

          <div className="gate-handle">
            <span />
          </div>

        </div>

      </div>

      {/* CENTER EMBLEM */}
      <div className="gate-center">

        <div className="gate-emblem">
          <span>✦</span>
        </div>

      </div>

      {/* Top arch ornament */}
      <div className="gate-top-ornament">

        <div className="ornament-line left" />

        <div className="ornament-diamond">
          ✦
        </div>

        <div className="ornament-line right" />

      </div>

    </div>
  )
}

/* =========================================================
   ZELLIGE MARK
   ========================================================= */

function ZelligeMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >

      <path
        d="
          M12 2
          L14.2 9.8
          L22 12
          L14.2 14.2
          L12 22
          L9.8 14.2
          L2 12
          L9.8 9.8
          Z
        "
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />

    </svg>
  )
}

/* =========================================================
   DIVIDER
   ========================================================= */

function Divider() {
  return (
    <div className="zellige-divider">

      <span className="line" />

      <ZelligeMark />

      <span className="line" />

    </div>
  )
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

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

    const id = setInterval(
      tick,
      60 * 1000
    )

    return () => clearInterval(id)

  }, [targetDate, targetTime])

  return left
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {

  const [settings, setSettings] = useState(null)

  const [schedule, setSchedule] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  /* -------------------------------------------------------
     LOAD WEDDING DATA
     ------------------------------------------------------- */

  useEffect(() => {

    async function load() {

      try {

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
            error: scheduleError,
          } = await supabase
            .from('wedding_schedule')
            .select('*')
            .eq('wedding_id', settingsData.id)
            .order('order_index', {
              ascending: true,
            })

          if (scheduleError) {

            console.warn(
              'Schedule loading error:',
              scheduleError.message
            )

          }

          setSchedule(scheduleData || [])
        }

        setSettings(settingsData)

        setLoading(false)

      } catch (err) {

        setError(
          err?.message ||
          'Une erreur est survenue.'
        )

        setLoading(false)
      }
    }

    load()

  }, [])

  /* -------------------------------------------------------
     COUNTDOWN
     ------------------------------------------------------- */

  const countdown = useCountdown(
    settings?.wedding_date,
    settings?.wedding_time
  )

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {

    return (
      <div className="loading">

        <div className="loading-inner">

          <div className="loading-mark">
            ✦
          </div>

          <p>
            Un instant, l'invitation se prépare…
          </p>

        </div>

      </div>
    )
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (error) {

    return (
      <div className="empty-state">

        <div>

          <div className="empty-mark">
            ✦
          </div>

          <p>
            Impossible de charger l'invitation.
          </p>

          <small>
            {error}
          </small>

        </div>

      </div>
    )
  }

  /* =======================================================
     NO WEDDING
     ======================================================= */

  if (!settings) {

    return (
      <div className="empty-state">

        <div>

          <div className="empty-mark">
            ✦
          </div>

          <p>
            Aucune information de mariage trouvée
            pour le moment.
          </p>

        </div>

      </div>
    )
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="page">

      {/* ==================================================
          ROYAL GATE INTRO
          ================================================== */}

      <RoyalGate />

      {/* ==================================================
          HERO
          ================================================== */}

      <section className="hero">

        <div className="hero-inner">

          {/* Eyebrow */}

          <div className="eyebrow">
            Nous nous marions
          </div>

          {/* Initials */}

          <p className="initials">

            {settings.initials ||
              `${settings.groom_name?.[0] || ''} & ${
                settings.bride_name?.[0] || ''
              }`}

          </p>

          {/* Names */}

          <p className="names">

            {settings.groom_name}

            <span className="names-amp">
              &amp;
            </span>

            {settings.bride_name}

          </p>

          {/* Quote */}

          {settings.wedding_quote && (

            <p className="quote">
              {settings.wedding_quote}
            </p>

          )}

          {/* Date */}

          {settings.wedding_date && (

            <div className="date-pill">

              <span className="date-icon">
                ✦
              </span>

              {formatDate(settings.wedding_date)}

            </div>

          )}

          {/* Countdown */}

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

          {/* Scroll hint */}

          <div className="scroll-hint">

            <span>
              Découvrez
            </span>

            <i />

          </div>

        </div>

      </section>

      {/* ==================================================
          DIVIDER
          ================================================== */}

      <Divider />

      {/* ==================================================
          MESSAGE
          ================================================== */}

      {(settings.invitation_message ||
        settings.couple_description) && (

        <Reveal>

          <section className="section message-section">

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

      {/* ==================================================
          DIVIDER
          ================================================== */}

      <Divider />

      {/* ==================================================
          DETAILS
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

              <div className="detail-icon">
                ✦
              </div>

              <div className="label">
                Date &amp; heure
              </div>

              <div className="value">

                {formatDate(
                  settings.wedding_date
                )}

              </div>

              {settings.wedding_time && (

                <div className="sub">

                  à {formatTime(
                    settings.wedding_time
                  )}

                </div>

              )}

            </div>

            {/* LIEU */}

            {settings.venue_name && (

              <div className="detail-card">

                <div className="detail-icon">
                  ✦
                </div>

                <div className="label">
                  Lieu
                </div>

                <div className="value">
                  {settings.venue_name}
                </div>

                {(settings.address ||
                  settings.city ||
                  settings.country) && (

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

                <div className="detail-icon">
                  ✦
                </div>

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

      {/* ==================================================
          FINAL DIVIDER
          ================================================== */}

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
