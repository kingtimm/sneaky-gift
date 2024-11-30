export const useUserEntitlementsStore = defineStore('userEntitlements', () => {

  const shouldPersist = useState('shouldPersist', ()=>true)
  const { isSignedIn  } = useAuth()

  const route = useRoute()
  const { id } = route.params

  watch([isSignedIn], () => {
    shouldPersist.value = !isSignedIn.value;
  }, {immediate: true})

  return {
    isPersisting: shouldPersist,
    // isSignedIn,
    // id
  }
})
