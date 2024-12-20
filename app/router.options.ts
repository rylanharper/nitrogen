import type { RouteLocationNormalized } from '#vue-router';
import type { RouterConfig } from 'nuxt/schema';

import { START_LOCATION } from 'vue-router';

/**
 * Enhanced router configuration for improved scroll behavior in Nuxt.
 * This is a temporary fix until the official PR is merged.
 * @see https://github.com/nuxt/nuxt/pull/24960
 */
function calculatePosition(
  to: RouteLocationNormalized,
  savedPosition: ScrollToOptions | null,
  behavior: ScrollBehavior = 'auto'
): ScrollToOptions {
  // Return saved position if available
  if (savedPosition) return savedPosition;

  // Scroll to element if hash is provided
  if (to.hash) {
    const element = document.querySelector(to.hash);
    const top = element ? element.getBoundingClientRect().top + window.scrollY : 0;
    return { top, left: 0, behavior };
  }

  // Default scroll to top of the page
  return { top: 0, left: 0, behavior };
}

export default <RouterConfig>{
  scrollBehavior: (to, from, savedPosition) => {
    const isFirstLoad = from === START_LOCATION;
    const nuxtApp = useNuxtApp();

    // Restore saved position on first load
    if (isFirstLoad && savedPosition) {
      window.history.scrollRestoration = 'auto';
      return savedPosition;
    }

    // Set manual scroll restoration for subsequent navigations
    window.history.scrollRestoration = 'manual';

    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:finish', () => {
        requestAnimationFrame(() => {
          resolve(calculatePosition(to, savedPosition, 'instant'));
        });
      });
    });
  }
};
