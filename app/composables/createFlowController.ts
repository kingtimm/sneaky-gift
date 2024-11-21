import type {TabbedNavigationPageItem} from "#shared/types/ui";

export default function useCreateFlowController() {

  const store = useSecretSantaListStore()

  const itemsComputed = ()=> {
    const { id } = useRoute().params
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

  const items = useState('items', itemsComputed)

  // const items = useState('items', () => [
  //   {
  //     label: 'Start',
  //     disabled: false,
  //     to: '/create/1-name/',
  //     controls: 'next-only'
  //   },
  //   {
  //     label: 'Members',
  //     disabled: true,
  //     to: '/create/2-members/',
  //     controls: 'both'
  //   },
  //   {
  //     label: 'Handling',
  //     disabled: true,
  //     to: '/create/3-handling/',
  //     controls: 'both'
  //   },
  //   {
  //     label: 'Complete',
  //     disabled: true,
  //     to: '/create/4-complete/',
  //     controls: 'previous-only'
  //   },
  // ] satisfies TabbedNavigationPageItem[])

  function shouldDisable(step: number) {
    // return True to disable
    const stepsPrerequisites: (() => boolean)[] = [
      () => false,
      () => store.inputState.name === "" || !StateZSchema.pick({ name: true }).safeParse(store.inputState).success,
      () => store.inputState.members.length <= 1,
      () => store.inputState.members.length <= 1,
    ]
    const result = stepsPrerequisites[step] ??= () => false
    return computed(result)

  }

  // tab logic
  const activeTab = useState('activeTab', ()=>0)
  const nextUrl = computed(() => items.value[activeTab.value + 1]?.to)
  const prevUrl = computed(() => items.value[activeTab.value - 1]?.to)

  function nextTab() {
    return navigateTo(nextUrl.value)
  }
  function previousTab() {
    return navigateTo(prevUrl.value)
  }

  const route = useRoute()

  watch([route], () => {
    if (route.name) {
      // update the tab
      const index = Number(route.name.toString()[7]) - 1
      activeTab.value = index

      // reflect in the items list
      items.value = itemsComputed()
    }
  }, {immediate: true})


  return {
    items,
    activeTab,
    prevUrl,
    nextUrl,
    previousTab,
    nextTab,
    shouldDisable
  }
}
