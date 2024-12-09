<script setup lang="ts">
import { z } from 'zod'
import type { SelectMenuItem } from '@nuxt/ui'
import { useCloned } from '@vueuse/core'

const schema = ListMemberZSchema.pick({ name: true })
type ListSchema = z.output<typeof schema>[]

const props = defineProps<{
  members: ListSchema
}>()

interface SelectMenuItemWithValue extends SelectMenuItem {
  label: string,
  disabled: boolean
}

function useArrays() {
  // this seems like it should be simplifed

  // get a couple copies of the list
  const getBaseArray = () => ref(props.members.map((item) => {
    return {
      label: item.name,
      disabled: false
    }
  }))

  const leftArray = getBaseArray()
  const { cloned: rightArray } = useCloned(getBaseArray())

  // update arrays if props change
  watch(props.members, () => {
    leftArray.value = getBaseArray().value
    rightArray.value = useCloned(leftArray).cloned.value
  })

  const leftValue: Ref<SelectMenuItemWithValue> = ref(leftArray.value[0]!)
  const rightValue: Ref<SelectMenuItemWithValue> = ref(rightArray.value[1]!)

  // update disabled status on a new item
  watch([leftValue, rightValue, props.members], () => {

    for (const item of leftArray.value) {
      item.disabled = (item.label === rightValue.value.label)
    }
    for (const item of rightArray.value) {
      item.disabled = (item.label === leftValue.value.label)
    }
  }, { immediate: true })

  return {
    leftArray,
    rightArray,
    leftValue,
    rightValue
  }
}

const { leftArray, leftValue, rightArray, rightValue } = useArrays()

const enoughMembers = computed(() => props.members.length > 1)

const direction = ref(0)

const store = useSecretSantaListStore()

const toast = useToast()

const SelectionZSchema = z.object({ label: z.string(), disabled: z.boolean() })

const PreventPairingFormSchema = z.object({
  rightValue: SelectionZSchema,
  leftValue: SelectionZSchema
})
  .refine(items => (items.rightValue.label !== items.leftValue.label), { message: 'Cannot be the same item' })
  .refine(items => (items.rightValue.label !== '' || items.leftValue.label !== ''), { message: 'Cannot be blank' })


function addRule() {

  // get the positions of the items in their lists
  const rightIndex = rightArray.value.findIndex((item) => (item.label === rightValue.value.label))
  const leftIndex = leftArray.value.findIndex((item) => (item.label === leftValue.value.label))

  // -1 = Left Only <, 1 = Right Only >, 0 should add both

  const exclusionsToAdd = [] as z.output<typeof ExclusionRowSchema>
  // parse if it is correct

  // 0 or Left
  if (direction.value < 1) {

    exclusionsToAdd.push([rightIndex, leftIndex])
  }
  if (direction.value > -1) {
    exclusionsToAdd.push([leftIndex, rightIndex])
  }
  for (const [x, y] of exclusionsToAdd) {
    if (x !== undefined && y !== undefined)
      //confirm they are not already in the list
    if (store.exclusions.find(e => JSON.stringify(e) === JSON.stringify([x, y]))) {
      return
    } else {
      store.inputState.members[x!]?.exclusions.push(y!)
    }

  }

  rightValue.value = { label: '', disabled: false }
  leftValue.value = { label: '', disabled: false }
}

const state = reactive({
  leftValue, rightValue
})

</script>

<template>
  <UForm v-if="enoughMembers" :state="state" :schema="PreventPairingFormSchema" class="flex gap-2 py-3 items-end w-full">
    <div class="flex gap-2 flex-1 items-end">
    <UFormField label="Name 1" name="leftValue" class="flex-1">
      <USelectMenu v-model="state.leftValue" class="h-8 w-full box-border" :items="leftArray" placeholder="Select a Name" />
    </UFormField>
    <PreventDirectionButton v-model="direction" />
    <UFormField label="Name 2" name="rightValue" class="flex-1">
      <USelectMenu v-model="state.rightValue" class="h-8 w-full box-border" :items="rightArray" placeholder="Select a Name" />
    </UFormField>
    </div>
    <UButton class="flex-0" label="Add" :disabled="!PreventPairingFormSchema.safeParse(state).success" @click="addRule()" />
  </UForm>
</template>
