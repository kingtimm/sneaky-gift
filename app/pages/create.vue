<template>
  <div>
    <CreateNavigation class="max-sm:hidden" :items="items" :active-tab="activeTab" />
    <NuxtPage v-bind="pageProps" />
    <div id="create-controls" class="flex justify-between space-x-4 mt-4">
      <div class="flex gap-2">
        <UButton
v-if="items[activeTab]?.controls === 'both' || items[activeTab]?.controls === 'previous-only'"
        variant="outline" label="Back" @click="previousTab()" />
        <UModal
v-model:open="open" title="Start Over" description="Press Delete to erase and start over."
          :ui="{ footer: 'justify-end' }">
          <UButton v-if="activeTab > 0" label="Start Over" icon="i-heroicons-trash" />

          <template #footer>
            <UButton label="Cancel" color="neutral" variant="outline" @click="open = false" />
            <UButton label="Delete" color="neutral" @click="handleDelete()" />
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
import createFlow from '~/middleware/createFlow';
import type { CreateFlowProps, TabbedNavigationPageItem } from '~~/shared/types/ui';

const open = ref(false)

const shouldPersist = useState('shouldPersist')

definePageMeta({
  middleware: [createFlow],
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

const { id } = useRoute().params

if(!id && useAuth().isSignedIn) {
  await store.reset()
} else if(id && useAuth().isSignedIn) {
  const { data } = await store.fetchListById(id.toString())
}

function nextTab() {
  return navigateTo(nextUrl.value)
}
function previousTab() {
  return navigateTo(prevUrl.value)
}

const pageProps = {
  onPrevious: previousTab,
  onNext: nextTab,
  index: activeTab.value,
  items: items.value,
  'page-key': (route) => route.fullPath

} satisfies CreateFlowProps

const route = useRoute()

watch([route], () => {
  const index = items.value.findIndex(row => {
    return route.path.startsWith(row.to)
  })

  // update the tab
  activeTab.value = index
}, {immediate: true})

// tab disabling
watch([store.inputState], async () => {
  for (const [index, item] of items.value.entries()) {
    item.disabled = store.shouldDisable(index).value
    if (id && !item.to.includes(id.toString())){
      item.to = item.to + `${id}`
    }
    await nextTick()
  }
}, { immediate: true })

async function handleDelete() {
  await store.reset()
  open.value = false
  return navigateTo('/create/1-name/')
}

</script>
