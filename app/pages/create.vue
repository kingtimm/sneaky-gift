<template>
  <div class="flex flex-col gap-2">
    <CreateNavigation class="" :items="items" :active-tab="activeTab"/>
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
            <UButton label="Cancel"  variant="outline" @click="open = false" />
            <UButton label="Delete"  @click="handleDelete()" />
          </template>
        </UModal>
      </div>
      <UButton
v-if="items[activeTab]?.controls === 'both' || items[activeTab]?.controls === 'next-only'"
        variant="outline" label="Next" :disabled="shouldDisable(activeTab + 1).value" @click="nextTab()" />
    </div>
    <NotSavingNotice v-if="isPersisting"/>
  </div>
</template>

<script setup lang="ts">
import createFlow from '~/middleware/createFlow';
import type { CreateFlowProps, TabbedNavigationPageItem } from '~~/shared/types/ui';
import useCreateFlowController from "~/composables/createFlowController";

const open = ref(false)

definePageMeta({
  middleware: [createFlow],
});

const { isSignedIn } = useAuth()
const store = useSecretSantaListStore()

const { isPersisting } = storeToRefs(useUserEntitlementsStore())
const { id } = useRoute().params

// get the items list
const { nextTab, previousTab, activeTab, items, shouldDisable, handlePageEntry} = useCreateFlowController()

const route = useRoute()
await handlePageEntry(route)

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
