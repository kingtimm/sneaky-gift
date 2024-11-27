<template>
  <div class="flex items-center">
    <div
      class="flex bg-neutral-200/90 dark:bg-neutral-800/90 w-full h-20 min-w-32 px-5 rounded-l-xl items-center justify-center text-white">
      <div class="wipe text-black dark:text-white" :style="computedStyle">
        <RandomName v-if="!name"/>
        <p v-else>{{ name }}</p>
      </div>
    </div>
    <UButton class="h-20 rounded-r-xl rounded-l-none opacity-80" v-bind="computedProps" @click="revealName()"/>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  name?: string
}>()

const revealed = defineModel<boolean>({default: false, required: false})

function revealName() {
  revealed.value = !revealed.value
}

const computedStyle = computed(() => {
  return {
    '--wipe-position': !revealed.value ? 'calc(-1 * var(--gradient-length))' : '100%'
  }
})

const computedProps = computed(() => {
  return {
    label: revealed.value ? 'Reveal' : 'Reveal',
    icon: revealed.value ? 'i-lucide-eye-off' : 'i-lucide-eye',

  }
})


</script>

<style scoped>
@property --wipe-position {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}

.wipe {
  --wipe-position: 100%;
  --gradient-length: 20%;
  mask-image: linear-gradient(
    to bottom right,
    black var(--wipe-position),
    transparent calc(var(--wipe-position) + var(--gradient-length)),
    transparent
  );
  transition: --wipe-position 600ms cubic-bezier(0, 0.55, 0.45, 1);
}

</style>
