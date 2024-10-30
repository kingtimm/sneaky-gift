<template>
  <div>
    <div class='flex items-center gap-4'>
      <h1 class="text-xl">Names</h1>
      <UButton label="Select Santas" @click="fetchPossibilities()" />
    </div>
    <div>
      <p v-if="possibilities?.total">Total Possibilities: {{ possibilities?.total }}</p>
    </div>
    <div class="flex">
      <div class="w-1/2 flex flex-col gap-2 font-thin w-full">
        <div
v-for="member, i in store.inputState.members" :key="i"
          class="flex-1 block font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
          {{ member.name }}
        </div>
      </div>
      <div v-if="possibilities?.possibility" class='w-1/2 flex flex-col gap-2 font-thin w-full'>
        <div
v-for="memberIdx, idx in possibilities.possibility" :key="idx"
          class="flex-1 block font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
          {{ store.inputState.members[memberIdx]?.name }}
        </div>
      </div>
      <Teleport defer to="#create-controls">
        <UButton type='submit' label="Save" />
      </Teleport>
    </div>

  </div>  


</template>

<script setup lang="ts">
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';

defineProps<{ items: TabsItem, index: number }>()

const store = useSecretSantaListStore()

const toast = useToast()
async function onSubmit(_event: FormSubmitEvent<InputStateSchema>) {
  toast.add({ title: 'Success', description: 'Created new List', color: 'success' })
  await $fetch('/api/lists', { method: 'post', body: store.inputState })
  store.inputState.name = ""
}

const { data: possibilities, execute: fetchPossibilities, error } = await useAsyncData('possibilities', () => store.getPossibilities(), {
  immediate: false
})

watch(error, ()=>{
  if (error.value) {
    toast.add({
      title: "Error",
      description: error.value.message
    })
  }
})

</script>