<template>
  <div>
    <CreateNavigation class="max-sm:hidden" :items="items" :active-tab="activeTab" />
    <NuxtPage :page-key="route => route.fullPath" :items="items" :index="activeTab" :surround-nav="surroundNav" />
    <div id="create-controls" class="flex justify-between space-x-4 mt-4">
      <div class="flex gap-2">
        <UButton
v-if="items[activeTab]?.controls === 'both' || items[activeTab]?.controls === 'previous-only'"
        variant="outline" label="Back" @click="previousTab()" />
        <UModal
v-model:open="open" title="Start Over" description="Press Delete to erase and start over."
          :ui="{ footer: 'justify-end' }">
          <UButton v-if="activeTab > 0" label="Start Over" icon="i-heroicons-trash" />
<!-- 
          <template #body>
            <p>Are you sure you want to start over?</p>
          </template> -->
    
          <template #footer>
            <UButton label="Cancel" color="neutral" variant="outline" @click="open = false" />
            <UButton label="Delete" color="neutral" @click="store.reset(); navigateTo('/create/1-name/'); open=false" />
          </template>
        </UModal>
      </div>
      <UButton
v-if="items[activeTab]?.controls === 'both' || items[activeTab]?.controls === 'next-only'"
        variant="outline" label="Next" :disabled="store.shouldDisable(activeTab + 1).value" @click="nextTab()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabbedNavigationPageItem } from '~~/types/ui';

const open = ref(false)

definePageMeta({
  middleware: [
    function (to, _from) {
      const store = useSecretSantaListStore()
      // Custom inline middleware to get to the start
      if (to.path === '/create' || to.path === '/create/') {
        return navigateTo('/create/1-name/')
      } else if
        (to.path !== '/create/1-name/') {
        if (store.inputState.name.length === 0) {
          return navigateTo('/create/1-name/')
        }

      }
    },
  ],
});

const store = useSecretSantaListStore()
const items = ref([
  {
    label: 'Start',
    disabled: false,
    to: '/create/1-name/',
    controls: 'next-only'
  },
  {
    label: 'Members',
    disabled: true,
    to: '/create/2-members/',
    controls: 'both'
  },
  {
    label: 'Handling',
    disabled: true,
    to: '/create/3-handling/',
    controls: 'both'
  },
  {
    label: 'Complete',
    disabled: true,
    to: '/create/4-complete/',
    controls: 'previous-only'
  },
] satisfies TabbedNavigationPageItem[])

// tab logic
const activeTab = ref(0)
const nextUrl = computed(() => items.value[activeTab.value + 1]?.to)
const prevUrl = computed(() => items.value[activeTab.value - 1]?.to)

function nextTab() {
  return navigateTo(nextUrl.value)
}
function previousTab() {
  return navigateTo(prevUrl.value)
}

const route = useRoute()

watch([route], () => {
  const index = items.value.findIndex(row => {
    return row.to === route.path
  })

  // update the tab
  activeTab.value = index
})

// tab disabling
watch([store.inputState], async () => {
  for (const [index, item] of items.value.entries()) {
    item.disabled = store.shouldDisable(index).value
    await nextTick()
  }
})


const surroundNav = reactive({
  prevUrl, nextUrl
})

</script>