<script setup lang="ts">
import type { TabbedNavigationPageItem } from '~~/shared/types/ui';

const props = defineProps<{
  items: TabbedNavigationPageItem[],
  activeTab: number,
}>()

</script>

<template>
    <UNavigationMenu highlight :items="items" class="justify-center mb-5">
      <template #item="{ index, active, item }">
        <div class="flex gap-2 items-center">
          <UBadge
          class="font-bold rounded-full justify-center w-7 h-7 max-sm:hidden" color='neutral'
          :variant="active === true ? 'outline': 'soft'">
          {{ index + 1 }}
        </UBadge>

        <p>{{ item.label }}</p>
        </div>
      </template>
    </UNavigationMenu>
</template>
