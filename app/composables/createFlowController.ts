import type {TabbedNavigationPageItem} from "#shared/types/ui";
import type {RouteLocationNormalized, RouteLocationNormalizedGeneric} from "vue-router";
import {useClerkProvider} from "vue-clerk";
import {until} from "@vueuse/core";

export default function useCreateFlowController() {

  const store = useSecretSantaListStore()

  const itemsComputed = () => {
    const {id} = useRoute().params
    const arr = [
      {
        label: 'Start',
        disabled: shouldDisable(0).value,
        to: `/create/1-name/${id ? id : ''}`,
        controls: 'next-only'
      },
      {
        label: 'Members',
        disabled: shouldDisable(1).value,
        to: `/create/2-members/${id ? id : ''}`,
        controls: 'both'
      },
      {
        label: 'Handling',
        disabled: shouldDisable(2).value,
        to: `/create/3-handling/${id ? id : ''}`,
        controls: 'both'
      },
      {
        label: 'Complete',
        disabled: shouldDisable(3).value,
        to: `/create/4-complete/${id ? id : ''}`,
        controls: 'previous-only'
      },
    ] satisfies TabbedNavigationPageItem[]

    return arr
  }

  const items = computed(itemsComputed)


  function shouldDisable(step: number) {
    // return True to disable
    const stepsPrerequisites: (() => boolean)[] = [
      () => false,
      () => store.inputState.name === "" || !StateZSchema.pick({name: true}).safeParse(store.inputState).success,
      () => store.inputState.members.length <= 1,
      () => store.inputState.members.length <= 1,
    ]
    const result = stepsPrerequisites[step] ??= () => false
    return computed(result)
  }

  function canLoadStep(toRoute: RouteLocationNormalizedGeneric) {
    const step = Number(toRoute.path.toString()[8]) - 1
    return !shouldDisable(step).value
  }

  // tab logic
  const activeTab = useState('activeTab', () => 0)
  const nextUrl = computed(() => items.value[activeTab.value + 1]?.to)
  const prevUrl = computed(() => items.value[activeTab.value - 1]?.to)

  function nextTab() {
    return navigateTo(nextUrl.value)
  }

  function previousTab() {
    return navigateTo(prevUrl.value)
  }

  // return
  function goToStart() {
    return navigateTo('/create/1-name/')
  }

  const {isLoaded, isSignedIn} = useAuth()

  /*
  create flow handling when we're not authenticated
  */
  async function handleIfNotAuthenticated(toRoute: RouteLocationNormalizedGeneric) {
    // clear store in case we're unauthenticated but have store data w/ id
    if (store.inputState.id) {
      await store.reset()
    }
    // re-route unless conditions below
    if ([
      !route.params.id, // should not have an id
      canLoadStep(toRoute), // should have sufficient state
    ].every(Boolean)) {
      return true
    } else {
      return goToStart()
    }
  }

  /*
    create flow handling if we are authenticated
  */

  async function handleIfAuthenticated(toRoute: RouteLocationNormalizedGeneric) {
    // this is a net new list authenticated
    if (toRoute.params.id) {
      // logged in and there is an toRoute.params.id
      const {refetch} = await store.fetchListById(toRoute.params.id.toString())
      await refetch()
    }

    // if there's a stored list but we're back on the raw create page
    if (store.inputState.id && !toRoute.params.id) {
      await store.reset()
    }

    // re-route unless conditions below
    if ([
      canLoadStep(toRoute), // should have sufficient state
    ].every(Boolean)) {
      return true
    } else {
      return goToStart()
    }
  }

  const route = useRoute()

  async function handlePageEntry(toRoute: RouteLocationNormalizedGeneric) {
    // this helps with https://github.com/wobsoriano/vue-clerk/issues/13
    const {isClerkLoaded} = useClerkProvider()
    if (import.meta.client) {
      await until(isClerkLoaded).toBe(true)
    }

    return (isLoaded.value && !isSignedIn.value)
      ? await handleIfNotAuthenticated(toRoute)
      : await handleIfAuthenticated(toRoute)
  }

  watch([route], () => {
    if (route.name) {
      // update the tab
      const index = Number(route.name.toString()[7]) - 1
      activeTab.value = index

    }
  }, {immediate: true})


  return {
    items,
    activeTab,
    prevUrl,
    nextUrl,
    previousTab,
    nextTab,
    shouldDisable,
    handlePageEntry
  }
}
