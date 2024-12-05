<script setup lang="ts">
import type {ContextMenuItem} from "@nuxt/ui/runtime/types";
import {useClipboard} from '@vueuse/core'


const props = defineProps<{
  name: string,
  memberId?: string,
}>()

const store = useSecretSantaListStore()

const {isSignedIn} = useAuth()

const route = useRoute()
const {id} = route.params

const shouldShow = useState('shouldShowMemberInListOptions', () =>
  (isSignedIn.value === true && props.memberId)
)

const items = ref([
  {
    label: 'Share Invite',
    icon: 'i-lucide-share',
    onSelect() {
      open.value = true
    }
  },
  {
    label: 'Copy Invite Link',
    icon: 'i-lucide-clipboard',
    onSelect() {
      copy(link.value)
    }
  },
] satisfies ContextMenuItem [])

const url = useRequestURL()

const link = ref(url.protocol + "//" + url.host + store.getInviteLink(id.toString(), props.memberId))

const {copy, copied} = useClipboard(link)

const toast = useToast()

const open = useState(() => false)

watch(copied, (newValue) => {
  if (newValue) {

    toast.add({
      title: 'Copied',
      description: `Copied link to clipboard: ${link.value}`,
    })
  }
})
</script>

<template>
  <div class="flex justify-between">

    {{ name }}
    <UDropdownMenu
      v-if="shouldShow"
      :items="items"
      :ui="{
      content: 'w-48'
    }"
    >
      <UButton icon="i-lucide-ellipsis" color="neutral" variant="subtle" size="xs"/>
    </UDropdownMenu>
    <UModal
      v-model:open="open" title="Share"
      :description="`Share an invitation with ${name}`"
      :ui="{ footer: 'justify-end' }">
      <!--        <UButton label="Update Gift Pairings" icon="i-lucide-gift"/>-->
      <template #body>
        <div class="space-y-4">
          <p>Create a personalize link and message for <strong>{{ name }}</strong>
          </p>

          <UContainer class="bg-[var(--ui-bg-elevated)] p-4">

            <p>👋 Hi <strong>{{ name }}</strong>! As part of the
              <strong>[Your List]</strong>
              gift exchange you're selecting for:
            </p>
            <RevealableName name="Example" class="w-full pt-1"/>
          </UContainer>
        </div>
      </template>
      <template #footer>
        <UButton label="Cancel" variant="outline" @click="open = false"/>
        <UButton label="Copy" icon="i-lucide-clipboard" @click="copy(link); open=false"/>
      </template>
    </UModal>
  </div>

</template>

<style scoped>

</style>
