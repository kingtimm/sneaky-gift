import {useClerkProvider} from "vue-clerk";
import {until} from '@vueuse/core';

export default defineNuxtRouteMiddleware(async (to, _from) => {

  // go to the start if there isn't anything stored
  const listStore = useSecretSantaListStore()
  const {isSignedIn, isLoaded, userId} = useAuth()

  // this helps with https://github.com/wobsoriano/vue-clerk/issues/13
  const {isClerkLoaded} = useClerkProvider()
  if (import.meta.client) {
    await until(isClerkLoaded).toBe(true)
  }

  // this should be protected elsewhere
  if (isLoaded.value && isSignedIn.value && to.params.id) {
    return true
  }

  if (to.path === '/create' || to.path === '/create/') {
    return navigateTo('/create/1-name/')
  }

  if (
    !to.params.id &&
    !to.path.startsWith('/create/1-name/') &&
    !listStore.inputState.name
  ) {
    return navigateTo('/create/1-name/')
  }

  // go back to main page if attempting to add a url when not loggedin
  if (!isSignedIn.value && to.params.id) {
    return navigateTo('/create/1-name/')
  }
})
