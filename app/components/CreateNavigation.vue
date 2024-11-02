<script setup lang="ts">
import type { TabbedNavigationPageItem } from '~~/types/ui';

const props = defineProps<{
  items: TabbedNavigationPageItem[],
  activeTab: number
}>()

function shouldShowName(index: number, active: boolean | undefined) {
  if (props.activeTab === index) {
    return true
  }
  // inactice
  if ((props.activeTab + 1) === index) {
    return true
  }

  return false
}

</script>

<template>
    <UNavigationMenu highlight :items="items" class="justify-center">
      <template #item="{ index, active, item }">
        <div class="flex gap-1 items-center">
          <UBadge
          class="font-bold rounded-full justify-center w-7 h-7 " color='neutral'
          :variant="active === true ? 'outline': 'soft'">
          {{ index + 1 }}
        </UBadge>
        
        <p v-if="shouldShowName(index, active)">{{ item.label }}</p>
        </div>
      </template>
    </UNavigationMenu>
</template>