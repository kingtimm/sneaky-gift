<template>
  <div>
    <h1 class="mt-5 text-xl">Start your list</h1>
    <p class="font-extralight">What is the name of the group? (e.g Work Friends, King Fam)</p>

    <UForm
ref="name-input" :schema="nameInputSchema" :state="store.inputState" class="py-2 space-y-4"
      @submit="emits('next')">
      <UFormField label="Name" name="name">
        <UInput ref="name-input" v-model="store.inputState.name" placeholder="Name your list" />
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

defineProps<{ items: TabsItem[], index: number }>()
const emits = defineEmits(['previous', 'next'])

const store = useSecretSantaListStore()

const nameInputSchema = StateZSchema.pick({ name: true })
const nameInputRef = useTemplateRef('name-input')

</script>