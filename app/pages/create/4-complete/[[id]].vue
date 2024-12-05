<template>
  <div class="flex flex-col gap-2">
    <div class='flex items-center gap-4'>
      <h1 class="text-xl">All set</h1>
    </div>
    <div class="flex justify-between gap-2">
      <UButton v-if="!store.currentScenario.length" label="Get Gift Pairings" icon="i-lucide-gift" @click="fetchPossibilities()"/>
      <UModal
        v-else
        v-model:open="open" title="Erase Pairings" description="This will replace gift pairing assignments. Please be careful if you have already shared."
        :ui="{ footer: 'justify-end' }">
        <UButton label="Update Gift Pairings" icon="i-lucide-gift"/>

        <template #footer>
          <UButton label="Cancel"  variant="outline" @click="open = false" />
          <UButton label="Confirm" icon="i-lucide-gift" @click="fetchPossibilities(); open=false"/>
        </template>
      </UModal>
      <UButton label="Show All" icon="i-lucide-eye" @click="allReveal = !allReveal"/>
    </div>

    <div class="flex gap-2">
      <div class="flex flex-col gap-2 font-thin w-full">
        <div
          v-for="(member, i) in store.inputState.members" :key="i.toString() + allReveal"
          class="font-thin flex justify-between items-center gap-2">
          <div class="flex-1 bg-[var(--ui-bg-elevated)] p-2 rounded">
            <MemberInList :name="member.name" :member-id="member.id"/>
          </div>
          <template v-if="store.currentScenario.length > 0 && store.currentScenario[i] !== undefined">

            <UIcon class="" name="i-lucide-arrow-right"/>

            <RevealableName

              class="flex-1"
              :trigger-all="allReveal"
              :name="store.inputState.members[store.currentScenario[i]]!.name"/>
          </template>
        </div>
      </div>
    </div>
    <div>
      <p v-if="possibilities?.total">Total Possibilities: {{ possibilities?.total }}</p>
    </div>
    <Teleport defer to="#create-controls">
      <UButton
v-if="!route.params.id" type='submit' :disabled="!shouldDisableSaveButton"
               :loading="asyncStatus === 'loading'" label="Save" @click="onSubmit()"/>
      <UButton
v-else type='submit' :loading="updateListAsyncStatus === 'loading'" :disabled="!shouldDisableSaveButton"
               label="Save Updates" @click="onSubmit()"/>
    </Teleport>

  </div>


</template>

<script setup lang="ts">
import type {FormSubmitEvent, TabsItem} from '@nuxt/ui';
import LoginCTA from '~/components/modals/LoginCTA.vue';
import type {ListInsertSchemaType} from '~~/shared/types/lists';
import RevealableName from "~/components/RevealableName.vue";
import MemberInList from "~/pages/create/4-complete/MemberInList.vue";

defineProps<{ items: TabsItem, index: number }>()

const store = useSecretSantaListStore()

const allReveal = useState('allReveal', () => false)

const open = useState(()=>false)

const toast = useToast()
const modal = useModal()
const route = useRoute()
const {isLoaded, isSignedIn} = useAuth()

async function onSubmit(_event?: FormSubmitEvent<InputStateSchema>) {
  if (isLoaded.value && isSignedIn.value) {
    const body = store.getSavePostData()
    if (route.params.id) {
      updateList(body)
    } else {
      createList(body)
    }
    toast.add({
      title: 'Saved Successfully',
      description: `Saved ${store.inputState.name}`
    })
    // return navigateTo('/lists/')
    return
  }
  modal.open(LoginCTA, {title: "Log in", redirectUrl: route.fullPath})
}

const {
  data: possibilities,
  execute: fetchPossibilities,
  error
} = await useAsyncData('possibilities', () => store.getPossibilities(), {
  immediate: false
})

const shouldDisableSaveButton = computed(() => {
  return (store.currentScenario.length === store.inputState.members.length) && store.currentScenario.length > 0
})

watch(error, () => {
  if (error.value) {
    toast.add({
      title: "Error",
      description: error.value.message
    })
  }
})


const fetchFn = useRequestFetch()

const {
  mutate: createList,
  status,
  asyncStatus,
  error: createListError
} = useMutation({
  mutation: (list: ListInsertSchemaType) => {
    return fetchFn('/api/lists', {
      method: 'POST',
      body: list
    })
  }
})

const {
  mutate: updateList,
  asyncStatus: updateListAsyncStatus,
  error: updateListError
} = useMutation({
  mutation: (list: ListInsertSchemaType) => {
    return fetchFn(`/api/lists/${route.params.id}`, {
      method: 'PATCH',
      body: list,
    })
  }
})

</script>
