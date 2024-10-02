export default defineNuxtRouteMiddleware((to, from) => {
  const isAuth = useAuthStore().isAuthenticated;
  const secureRoutes = ['account', 'account-orders', 'account-addresses'];

  if (secureRoutes.includes(to.name as string) && !isAuth) {
    return navigateTo({ name: 'account-login' });
  }

  if (to.name === 'account-login' && isAuth) {
    return navigateTo({ name: 'account' });
  }

  if (to.name === 'account-register' && isAuth) {
    return navigateTo({ name: 'account' });
  }
});
