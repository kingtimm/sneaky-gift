<template>
  <div>
    <h1 class="mt-5 text-xl">Who's in?</h1>
    <p class="font-extralight">Enter members in the gift exchange group</p>
    <UForm
:schema="listMemberInputSchema" :state="store.newMemberInputState" class="py-4 space-y-4"
      @submit.prevent="addMember">
      <UFormField label="Members" name="name">
        <div class="flex gap-3">
          <UInput ref='memberInput' v-model="store.newMemberInputState.name" placeholder="Who is on the list?" />
          <UButton
label="Add" :disabled="!listMemberInputSchema.safeParse(store.newMemberInputState).success"
            @click="addMember" />
        </div>
      </UFormField>
    </UForm>
    <div v-if="store.inputState.members.length > 0">
      <h1 class="mt-5 text-xl">Names</h1>
      <div v-auto-animate class="py-3 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 font-thin w-full">
        <div
v-for="member, i in store.inputState.members" :key="i"
          class="font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
          {{ member.name }}
          <UButton
variant="soft" label="Remove"
            @click="store.inputState.members = store.inputState.members.filter((_, id) => id != i)" />
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

defineProps<{ items: TabsItem, index: number }>()
const emits = defineEmits(['previous', 'next'])

const store = useSecretSantaListStore()
const {inputState} = storeToRefs(store)
const toast = useToast()

const listMemberInputRef = useTemplateRef('memberInput')
const listMemberInputSchema = ListMemberZSchema.pick({ name: true }).refine(item => !store.inputState.members.some((row) => row.name === item.name), { message: "Must be a unique name" })

async function addMember() {
  const result = listMemberInputSchema.safeParse(store.newMemberInputState)
  if (!result.success) {
    toast.add({
      description: result.error.formErrors.formErrors.toString(),
      title: 'Error'
    })
    return
  }
  inputState.value.members?.push(
    {
      name: store.newMemberInputState.name,
      exclusions: []
    }
  )
  toast.add({
    title: 'Added',
    description: `${store.newMemberInputState.name} is added`
  })
  store.newMemberInputState.name = ""
  setTimeout(() => listMemberInputRef.value?.inputRef?.focus(), 100)
}



</script>