export default defineNuxtRouteMiddleware((to, _from) => {
  
  
  // go to the start if there isn't anything stored
  const store = useSecretSantaListStore()
  if (to.path === '/create' || to.path === '/create/') {
    return navigateTo('/create/1-name/')
  } else if
    (!to.path.startsWith('/create/1-name/')) {
    if (store.inputState.name.length === 0) {
      return navigateTo('/create/1-name/')
    }
  }
  
  // go back to main page if attempting to add a url when not loggedin
  const { userId } = useAuth()
  const { id } = to.params
  if (!userId.value && id) {
    return navigateTo('/create/1-name/')
  }
  if (userId.value && id) {
    useState('shouldPersist').value = false
    return true
  }
})