<template>
  <div ref="parent">
    <UButton v-if="!revealed" color="neutral" variant="ghost" icon="i-heroicons-eye" @click="revealName()">
      Reveal
    </UButton>
    <div v-else>
      <RandomName v-if="!name"/>
      <p v-else>{{  name  }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  name?: string
}>()

const [parent] = useAutoAnimate({duration: 500, easing: 'ease-out', })
const revealed = defineModel<boolean>({default: false, required: false})

function revealName() {
  revealed.value = !revealed.value
}
</script>