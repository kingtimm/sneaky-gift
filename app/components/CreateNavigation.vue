<script setup lang="ts">
import type { TabbedNavigationPageItem } from '~~/types/ui';

defineProps<{
  items: TabbedNavigationPageItem[],
}>()

</script>

<template>
    <UNavigationMenu highlight :items="items" class="justify-center">
      <template #item-leading="{ index, active }">
        <UBadge
  class="font-bold rounded-full justify-center mr-2 w-7 h-7 " color='neutral'
          :variant="active === true ? 'outline': 'soft'">
          {{ index + 1 }}
        </UBadge>
      </template>
    </UNavigationMenu>
</template>