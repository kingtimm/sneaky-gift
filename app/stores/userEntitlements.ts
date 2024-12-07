export const useUserEntitlementsStore = defineStore('userEntitlements', () => {

  const shouldPersist = useState('shouldPersist', ()=>true)
  const { isSignedIn  } = useAuth()

  const listStore = useSecretSantaListStore()

  watch(isSignedIn, async (newValue, _oldValue) => {
    shouldPersist.value = !isSignedIn.value

    // should reset when we're going from logged in to logged out
    if(!newValue) {
      await listStore.reset()
    }
  }, {immediate: true})

  return {
    isPersisting: shouldPersist,

  }
})
