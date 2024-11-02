<template>
  <UContainer class="flex flex-col gap-2">
    <div class='flex items-center gap-4'>
      <h1 class="text-xl">Names</h1>
      <UButton label="Select Santas" @click="fetchPossibilities()" />
    </div>
    <div>
      <p v-if="possibilities?.total">Total Possibilities: {{ possibilities?.total }}</p>
    </div>
    <div class="flex gap-2">
      <div class="flex flex-col gap-2 font-thin w-full">
        <div
v-for="member, i in store.inputState.members" :key="i"
          class="font-thin flex justify-between items-center gap-2">
          <div class="flex-1 bg-neutral-800 p-2 rounded">
          {{ member.name }}
          </div>
          <template v-if="possibilities?.possibility">
                  <UIcon class="" name="i-heroicons-arrow-right-20-solid" />
                  <div class="flex-1 font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
                      <div v-if="possibilities.possibility[i] !== undefined" class="flex items-center">
                      
                      {{ store.inputState.members[possibilities.possibility[i]].name }}
                    </div>
                </div>
            </template>
        </div>
      </div>
      <Teleport defer to="#create-controls">
        <UButton type='submit' label="Save" @click="onSubmit()" />
      </Teleport>
    </div>

  </UContainer>


</template>

<script setup lang="ts">
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';
import LoginCTA from '~/components/modals/LoginCTA.vue';

defineProps<{ items: TabsItem, index: number }>()

const store = useSecretSantaListStore()

const toast = useToast()
const modal = useModal()
async function onSubmit(_event?: FormSubmitEvent<InputStateSchema>) {
  modal.open(LoginCTA, { title: "Log in" })
}

const { data: possibilities, execute: fetchPossibilities, error } = await useAsyncData('possibilities', () => store.getPossibilities(), {
  immediate: false
})

watch(error, () => {
  if (error.value) {
    toast.add({
      title: "Error",
      description: error.value.message
    })
  }
})

</script>