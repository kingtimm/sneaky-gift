import { defineStore } from 'pinia'
import { beforeHydrateClear } from '~/utils/persistedStorage'

export const useSecretSantaListStore = defineStore('secretSantaList', () => {
  const _defaultState = () => {
    return {
      name: '',
      suggestedSpend: 20,
      members: [] as InputStateSchema["members"],
      id: ''
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

  function invalidateCurrentScenario() {
    possibilities.value = 0
    currentScenario.value = []
  }

  // create a new 'useListById' function that takes id and returns {id, ...query}
  async function fetchListById(id: string) {
    const fetchFn = useRequestFetch()
    const {data, ...rest} = useQuery({
      key: () => ['lists', id],
      query: () => fetchFn(`/api/lists/${id}`).then((res)=>{
        if (res) {
          const d = res
          inputState.value.id = d.id
          inputState.value.name = d.name
          const sorted = d.members.sort((a, b) => a.position - b.position)
          inputState.value.members = sorted.map(row => {
            return {
              'name': row.name!, 'exclusions': JSON.parse(row.exclusions), id: row.id
            }
          })
          currentScenario.value = JSON.parse(d?.currentScenario)
        }
        return res

      }),
      enabled: false
    })

   return {data, ...rest}
  }

  function getInviteLink(id: string, memberid: string) {
    return `/invites/${id}/${memberid}`
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
    fetchListById,
    getInviteLink,
    invalidateCurrentScenario,
  }
}, {
  persist: {
    storage: optInCookies(),
    beforeHydrate: beforeHydrateClear
  },
})

