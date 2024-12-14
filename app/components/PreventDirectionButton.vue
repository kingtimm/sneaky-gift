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
        icon: 'i-lucide-chevron-left',
        'aria-label': 'Left Only',
      }
    }
    case 1: {
      return {
        icon: 'i-lucide-chevron-right',
        'aria-label': 'Right Only',
      }
    }

    default: {
      return {
        icon: 'i-lucide-arrow-right-left',
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
