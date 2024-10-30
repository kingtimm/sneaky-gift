<script setup lang="ts">
import { useCycleList } from '@vueuse/core';
const direction = defineModel<number>()
interface ButtonProps {
  icon: string,
  'aria-label': string
}

const buttonProps: ComputedRef<ButtonProps> = computed(() => {
  switch (state.value) {
    case -1: {
      return {
        icon: 'i-heroicons-chevron-left',
        'aria-label': 'Left Only',
      }
    }
    case 1: {
      return {
        icon: 'i-heroicons-chevron-right',
        'aria-label': 'Right Only',
      }
    }

    default: {
      return {
        icon: 'i-heroicons-arrows-right-left',
        'aria-label': 'Both',
      }
    }
  }
})

const { state, next } = useCycleList(ref([-1, 0, 1]), {
  initialValue: direction,
})

watch(state, (newState) => {
  direction.value = newState
})

</script>

<template>
    <UButton v-bind="buttonProps" @click="next()"/>
</template>