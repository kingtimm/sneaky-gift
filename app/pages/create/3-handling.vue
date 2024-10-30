<template>
  <div v-if='store.inputState.members.length > 1'>
    <div>
      <h1 class="mt-5 text-xl">Prevent Pairings</h1>
      <p class="font-extralight">Any secret santa pairings we should prevent?</p>
      <PreventPairingSelect :members="store.inputState.members" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

const props = defineProps<{ items: TabsItem[], index: number }>()
const emit = defineEmits<{
  nextTab: [e?: Event],
  previousTab: [e?: Event],
}>()

const store = useSecretSantaListStore()

</script>