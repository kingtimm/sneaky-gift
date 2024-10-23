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
  members: z.array(ListMemberZSchema)
})

export type InputStateSchema = z.output<typeof StateZSchema>

export const useSecretSantaListStore = defineStore('secretSantaList', () => {
  
  const inputState:Reactive<InputStateSchema> = reactive({ 
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
    const data = await $fetch('/api/match', {method:'post', body: {
      memberList: [...inputState.members.keys()], // only send the keys
      exclusions: inputState.members.flatMap(i=>i.exclusions)
    }})
    possibilities.value = data.total
    currentScenario.value = data.possibility
    console.log('got it!', data)
    return data
  }
  
  function shouldDisable(step: number) {


    // TODO Cannot return a function here. need to debounce
    const stepsPrerequisites: (() => boolean)[] = [
      () => false,
      () => inputState.name === ""  || !StateZSchema.pick({name:true}).safeParse(inputState).success,
      () => inputState.members.length <= 1,
    ] 
    const result = stepsPrerequisites[step] ??= () => false
    return computed(result)
  
  }

  return {
    inputState,
    newMemberInputState,
    getPossibilities,
    shouldDisable
  }
})