<template>
  <UForm
ref="name-input" :schema="nameInputSchema" :state="store.inputState" class="space-y-4"
    @submit="navigateTo(surroundNav.nextUrl)">
    <UFormField label="Name" name="name">
      <UInput ref="name-input" v-model="store.inputState.name" placeholder="Name your list" />
    </UFormField>
  </UForm>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

const props = defineProps<{ items: TabsItem[], index: number , surroundNav: {prevUrl: string, nextUrl: string}}>()


const store = useSecretSantaListStore()

const nameInputSchema = StateZSchema.pick({ name: true })
const nameInputRef = useTemplateRef('name-input')

</script>