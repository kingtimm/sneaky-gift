export default defineNuxtRouteMiddleware((to, _from) => {

  // go to the start if there isn't anything stored
  const listStore = useSecretSantaListStore()
  const {inputState} = storeToRefs(listStore)
  const {isSignedIn} = useAuth()
  console.log('from middleware', inputState.value.name)

  if (to.path === '/create' || to.path === '/create/') {
    return navigateTo('/create/1-name/')
  }

  if (
    !to.params.id &&
    !to.path.startsWith('/create/1-name/') &&
    !inputState.value.name
  ) {
    return navigateTo('/create/1-name/')
  }

  // go back to main page if attempting to add a url when not loggedin
  if (!isSignedIn.value && to.params.id) {
    return navigateTo('/create/1-name/')
  }
})
