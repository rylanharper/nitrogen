export default defineNuxtRouteMiddleware((to) => {
  const isAuth = useAuthStore().isAuthenticated

  if (to.meta.groups?.includes('protected') && !isAuth) {
    return navigateTo('/account/login')
  }

  if ((
    to.name === 'account-login' ||
    to.name === 'account-register'
    // ...
  ) && isAuth) {
    return navigateTo('/account')
  }
})
