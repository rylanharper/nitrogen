import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      screens: {
        '3xl': '1920px'
      },
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono]
      }
    }
  }
}
