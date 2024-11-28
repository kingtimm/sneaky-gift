<script setup lang="ts">
import type { ContextMenuItem } from "@nuxt/ui/runtime/types";
import { useClipboard } from '@vueuse/core'


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
    label: 'Copy Invite Link',
    icon: 'i-lucide-link',
    onSelect () {
      copy(link.value)
    }
  }
] satisfies ContextMenuItem [])

const url = useRequestURL()

const link = ref(url.protocol + "//" + url.host + store.getInviteLink(id!, props.memberId))

const { copy, copied } = useClipboard(link.value)

const toast = useToast()

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
      <UButton icon="i-lucide-menu" color="neutral" variant="ghost"/>
    </UDropdownMenu>
  </div>

</template>

<style scoped>

</style>
