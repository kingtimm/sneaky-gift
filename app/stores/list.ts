import { defineStore } from 'pinia'
import type { Reactive } from 'vue'
import { z } from 'zod'

export const ListMemberZSchema = z.object({
  name: z.string()
    .min(1, "Name must be at least 1 character")
    .max(35, "Name must be fewer than 36 Characters"),
  exclusions: z.array(z.number())
})

// TODO: move this to types?
export const StateZSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be fewer than 30 characters"),
  suggestedSpend: z.number(),
  members: z.array(ListMemberZSchema).refine(items => new Set(items).size === items.length, { message: "Must be a unique name" })
})
export type InputStateSchema = z.output<typeof StateZSchema>

export const ExclusionRowSchema = z.array(
  z.array(z.number()).length(2))
  // .refine(
  //   items => new Set(items).size === items.length,
  //   { message: "Must not already be a rule for this" })
  .refine(items => {
    for (const pair of items) {
      if (typeof pair[0] === 'number' && typeof pair[1] === 'number') {
        return pair[0] !== pair[1]}
    }
  }, { message: "Secret Santa already excludes self-gifting" })

export const useSecretSantaListStore = defineStore('secretSantaList', () => {

  const inputState: Reactive<InputStateSchema> = reactive({
    name: '',
    suggestedSpend: 20,
    members: [] as InputStateSchema["members"]
  })

  const newMemberInputState = reactive({
    name: ''
  })

  const possibilities = ref(0)
  const currentScenario: Ref<number[]> = ref([0])

  async function getPossibilities() {
    const data = await $fetch('/api/match', {
      method: 'post', body: {
        memberList: [...inputState.members.keys()], // only send the keys
        exclusions: exclusions.value
      }
    })
    possibilities.value = data.total
    currentScenario.value = data.possibility
    console.log('got it!', data)
    return data
  }

  function shouldDisable(step: number) {
    // return True to disable
    const stepsPrerequisites: (() => boolean)[] = [
      () => false,
      () => inputState.name === "" || !StateZSchema.pick({ name: true }).safeParse(inputState).success,
      () => inputState.members.length <= 1,
      () => inputState.members.length <= 1,
    ]
    const result = stepsPrerequisites[step] ??= () => false
    return computed(result)

  }

  const exclusions = computed(() => {
    const result: [number, number][] = []  

    for (const [memberIndex, member] of inputState.members.entries()){
      for (const exclusionIndex of member.exclusions) {
        if (inputState.members[exclusionIndex]) {
          result.push([
            memberIndex,
            exclusionIndex
          ])
        }
      }
    }
    return result
  })

  const exclusionsAsName = computed(()=> {
    return exclusions.value.map((row)=> {
        return [
          inputState.members[row[0]]?.name,
          inputState.members[row[1]]?.name,
        ]
    })
  })

  return {
    inputState,
    newMemberInputState,
    getPossibilities,
    shouldDisable,
    exclusions,
    exclusionsAsName
  }
})