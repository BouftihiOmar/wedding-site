import { useEffect } from 'react'

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

const SPEED_MAP = {
  anim_door_speed: '--speed-door',
  anim_reveal_speed: '--speed-reveal',
  anim_glow_speed: '--speed-glow',
}

export default function ThemeInjector({ settings }) {
  useEffect(() => {
    if (!settings) return

    const root = document.documentElement

    // 1. Appliquer les couleurs si elles existent
    Object.entries(COLOR_MAP).forEach(([field, cssVar]) => {
      if (settings[field]) {
        root.style.setProperty(cssVar, settings[field])
      }
    })

    // 2. Appliquer les vitesses (Vérification pour éviter 0 ou vide)
    Object.entries(SPEED_MAP).forEach(([field, cssVar]) => {
      const val = settings[field]
      if (val !== undefined && val !== null && val !== '' && Number(val) > 0) {
        root.style.setProperty(cssVar, `${val}s`)
      }
    })
  }, [settings])

  return null
}
