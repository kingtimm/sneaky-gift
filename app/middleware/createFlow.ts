import {useClerkProvider} from "vue-clerk";
import {until} from '@vueuse/core';

export default defineNuxtRouteMiddleware(async (to, _from) => {

  // go to step one automatically
  if (to.path === '/create' || to.path === '/create/') {
    return navigateTo('/create/1-name/')
  }

  // this helps with https://github.com/wobsoriano/vue-clerk/issues/13
  const {isClerkLoaded} = useClerkProvider()
  if (import.meta.client) {
    await until(isClerkLoaded).toBe(true)
  }

})
