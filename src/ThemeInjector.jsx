import { useEffect } from 'react'

// Correspondance : colonne Supabase -> variable CSS
const COLOR_MAP = {
  color_bg: '--color-bg',
  color_bg_deep: '--color-bg-deep',
  color_ink: '--color-ink',
  color_ink_soft: '--color-ink-soft',
  color_gold: '--color-gold',
  color_gold_soft: '--color-gold-soft',
  color_gold_light: '--color-gold-light',
  color_emerald: '--color-emerald',
  color_clay: '--color-clay',
  color_door_dark: '--color-door-dark',
  color_door_light: '--color-door-light',
}

// Correspondance : colonne Supabase (nombre en secondes) -> variable CSS (avec "s")
const SPEED_MAP = {
  anim_door_speed: '--speed-door',
  anim_reveal_speed: '--speed-reveal',
  anim_glow_speed: '--speed-glow',
}

// Composant invisible : applique les couleurs et vitesses stockées dans
// `settings` (venant de Supabase) directement sur la page, en live.
// À placer une fois sur la page publique, et une fois dans l'admin
// (pour avoir un aperçu pendant qu'on modifie).
export default function ThemeInjector({ settings }) {
  useEffect(() => {
    if (!settings) return

    const root = document.documentElement

    Object.entries(COLOR_MAP).forEach(([field, cssVar]) => {
      if (settings[field]) {
        root.style.setProperty(cssVar, settings[field])
      }
    })

    Object.entries(SPEED_MAP).forEach(([field, cssVar]) => {
      if (settings[field] !== undefined && settings[field] !== null && settings[field] !== '') {
        root.style.setProperty(cssVar, `${settings[field]}s`)
      }
    })
  }, [settings])

  return null
}
