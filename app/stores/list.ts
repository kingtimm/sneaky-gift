import { defineStore } from 'pinia'
import { beforeHydrateClear } from '~/utils/persistedStorage'

export const useSecretSantaListStore = defineStore('secretSantaList', () => {
  const _defaultState = () => {
    return {
      name: '',
      suggestedSpend: 20,
      members: [] as InputStateSchema["members"]
    }
  }

  const inputState: Ref<InputStateSchema> = ref(_defaultState())

  const newMemberInputState = reactive({
    name: ''
  })

  const possibilities = ref(0)
  const currentScenario: Ref<number[]> = ref([])

  async function reset() {
    inputState.value = _defaultState()
    possibilities.value = 0
    currentScenario.value = []
    await nextTick()
  }

  async function getPossibilities() {
    const data = await $fetch('/api/match', {
      method: 'post', body: {
        memberList: [...inputState.value.members.keys()], // only send the keys
        exclusions: exclusions.value
      }
    })
    possibilities.value = data.total
    currentScenario.value = data.possibility
    return data
  }

  watch(inputState.value.members, (_newValue, _oldValue) => {
    // reset current scenario and possibilities
    possibilities.value = 0
    currentScenario.value = []
  })

  const fetchFn = useRequestFetch()

  // create a new 'useListById' function that takes id and returns {id, ...query}
  async function fetchListById(id: string) {
    const {data, ...rest} = useQuery({
      key: () => ['lists', id],
      query: () => fetchFn(`/api/lists/${id}`),
    })

    if (data.value) {
      inputState.value.name = data.value.name
      inputState.value.members = data.value.members.map(row => {
        return {
        'name': row.name!, 'exclusions': JSON.parse(row.exclusions), id: row.id
        }
      })
      currentScenario.value = JSON.parse(data.value?.currentScenario)
    }
    return {data, ...rest}
  }


  const exclusions = computed(() => {
    const result: [number, number][] = []

    for (const [memberIndex, member] of inputState.value.members.entries()) {
      for (const exclusionIndex of member.exclusions) {
        if (inputState.value.members[exclusionIndex]) {
          result.push([
            memberIndex,
            exclusionIndex
          ])
        }
      }
    }
    return result
  })

  const exclusionsAsName = computed(() => {
    return exclusions.value.map((row) => {
      return [
        inputState.value.members[row[0]]?.name,
        inputState.value.members[row[1]]?.name,
      ]
    })
  })

  function getMemberListForInsert() {
    return inputState.value.members.map((member, index) => {
      return {
        position: index,
        ...member
      }
    })
  }

  function getSavePostData() {
    return {
      name: inputState.value.name,
      members: getMemberListForInsert(),
      currentScenario: currentScenario.value
    } satisfies ListInsertSchemaType
  }

  return {
    inputState,
    newMemberInputState,
    getPossibilities,
    exclusions,
    exclusionsAsName,
    reset,
    currentScenario,
    getSavePostData,
    fetchListById
  }
}, {
  persist: {
    storage: optInCookies(),
    beforeHydrate: beforeHydrateClear
  },
})

