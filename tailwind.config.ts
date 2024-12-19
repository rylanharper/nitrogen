import type { Config } from 'tailwindcss';

import defaultTheme from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono]
      }
    }
  }
};
