export const useUserEntitlementsStore = defineStore('userEntitlements', () => {

  const shouldPersist = useState('shouldPersist', ()=>true)
  const { isSignedIn  } = useAuth()

  const route = useRoute()
  const listStore = useSecretSantaListStore()
  const { id } = route.params

  watch(isSignedIn, (newValue, _oldValue) => {
    shouldPersist.value = !isSignedIn.value

    // should reset when we're going from logged in to logged out
    if(!newValue) {
      listStore.reset()
    }
  }, {immediate: true})

  return {
    isPersisting: shouldPersist,
    // isSignedIn,
    // id
  }
})
