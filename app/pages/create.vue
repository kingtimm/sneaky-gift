<template>
  <div>
    <CreateNavigation class="max-sm:hidden" :items="items" :active-tab="activeTab"/>
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
        variant="outline" label="Next" :disabled="shouldDisable(activeTab + 1).value" @click="nextTab()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import createFlow from '~/middleware/createFlow';
import type { CreateFlowProps, TabbedNavigationPageItem } from '~~/shared/types/ui';
import useCreateFlowController from "~/composables/createFlowController";

const open = ref(false)

const shouldPersist = useState('shouldPersist')

definePageMeta({
  middleware: [createFlow],
});

const store = useSecretSantaListStore()


// when this route is an id
const route = useRoute()
const { id } = route.params
const { isSignedIn } = useAuth()

if(!id && isSignedIn.value) {
  await store.reset()
} else if(id && isSignedIn.value) {
  await store.fetchListById(id.toString())
}

// get the items list
const { nextTab, previousTab, nextUrl, prevUrl, activeTab, items, shouldDisable} = useCreateFlowController()

// props to pass to nested pages
const pageProps = {
  onPrevious: previousTab,
  onNext: nextTab,
  index: activeTab.value,
  items: items.value,
  pageKey: (route) => route.fullPath

} satisfies CreateFlowProps


async function handleDelete() {
  await store.reset()
  open.value = false
  return navigateTo('/create/1-name/')
}

</script>
