export default defineNuxtRouteMiddleware((to) => {
  const isAuth = useAuthStore().isAuthenticated
  const secureRoutes = ['account', 'account/orders', 'account/addresses']

  if (secureRoutes.includes(to.name as string) && !isAuth) {
    return navigateTo('/account/login')
  }

  if (to.name === 'account-login' && isAuth) {
    return navigateTo('/account')
  }

  if (to.name === 'account-register' && isAuth) {
    return navigateTo('/account')
  }
})
