<script setup lang="ts">
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';
import { index } from 'drizzle-orm/mysql-core';
import type { InputStateSchema } from '~/stores/list';
import { useSecretSantaListStore } from '~/stores/list';

const store = useSecretSantaListStore()

const items = ref([
  {
    label: 'Getting Started',
    slot: 'start',
    disabled: false,
  },
  {
    label: 'Members',
    slot: 'members',
    disabled: true,
  },
  {
    label: 'Complete',
    slot: 'complete',
    disabled: true,
  },
] satisfies TabsItem[])

// tab logic
const activeTab = ref('0')

function nextTab() {
  return activeTab.value = String(Number(activeTab.value) + 1)
}
function previousTab() {
  return activeTab.value = String(Number(activeTab.value) - 1)
}


const nameInputSchema = StateZSchema.pick({ name: true })
const nameInputRef = useTemplateRef('name-input')

// tab disabling
watch([store.inputState], async () => {
  for (const [index, item] of items.value.entries()) {
    item.disabled = store.shouldDisable(index).value
    await nextTick()
  }
})

// add button disabling 

const listMemberInputRef = useTemplateRef('member-input')
const listMemberInputSchema = ListMemberZSchema.pick({ name: true })

async function addMember() {
  store.inputState.members?.push(
    {
      name: store.newMemberInputState.name,
      exclusions: []
    }
  )
  store.newMemberInputState.name = ""
  if (listMemberInputRef.value?.inputRef) {
    await nextTick()
    listMemberInputRef.value.inputRef.focus()
  }
}


const toast = useToast()
async function onSubmit(event: FormSubmitEvent<InputStateSchema>) {
  toast.add({ title: 'Success', description: 'Created new List', color: 'success' })
  await $fetch('/api/lists', { method: 'post', body: store.inputState })
  store.inputState.name = ""
}

const { data: possibilities, execute: fetchPossibilities } = await useAsyncData('possibilities', () => store.getPossibilities(), {
  immediate: false
})


</script>

<template>
  <UTabs v-model="activeTab" color="neutral" variant="link" :items="items" class="stepper w-full">
    <template #leading="{ index, item }">
      <UBadge
class="font-bold rounded-full justify-center mr-2 w-7 h-7 "
        :variant="index.toString() === activeTab ? 'solid' : 'soft'">
        {{ index + 1 }}
      </UBadge>
    </template>
    <template #start="{ item, index }">
      <UForm ref="name-input" :schema="nameInputSchema" :state="store.inputState" class="space-y-4" @submit="nextTab()">
        <UFormField label="Name" name="name">
          <UInput v-model="store.inputState.name" />
        </UFormField>
        <div class="flex justify-end space-x-4">
          <UButton label="Next" :disabled="store.shouldDisable(index + 1).value" @click="nextTab()" />
        </div>
      </UForm>
    </template>
    <template #members="{ item, index }">
      <UForm
:schema="listMemberInputSchema" :state="store.newMemberInputState" class="space-y-4"
        @submit.prevent="addMember">
        <UFormField :label="`Members in ${store.inputState.name}`" name="members">
          <UInput ref='member-input' v-model="store.newMemberInputState.name" />
        </UFormField>
        <UButton
label="Add" :disabled="!listMemberInputSchema.safeParse(store.newMemberInputState).success"
          @click="addMember" />
      </UForm>
      <div v-if="store.inputState.members.length > 0">
        <h1 class="mt-5 text-xl">Names</h1>
        <div class="py-3 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 font-thin w-full">
          <div
v-for="member, i in store.inputState.members" :key="i"
            class="font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
            {{ member.name }}
            <UButton
variant="soft" label="Remove"
              @click="store.inputState.members = store.inputState.members.filter((_, id) => id != i)" />
          </div>
        </div>

      </div>
      <div class="flex justify-between space-x-4 mt-4">
        <UButton label="Back" @click="previousTab()" />
        <UButton label="Next" :disabled="store.shouldDisable(index + 1).value" @click="nextTab()" />
      </div>
    </template>
    <template #complete="{ item }">
      <div class='flex items-center gap-4'>
        <h1 class="text-xl">Names</h1>
        <UButton label="Select Santas" @click="fetchPossibilities()" />
      </div>

      <div class="flex">
        <div class="w-1/2 flex flex-col gap-2 font-thin w-full">
          <div
v-for="member, i in store.inputState.members" :key="i"
            class="flex-1 block font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
            {{ member.name }}
          </div>
        </div>
        <div v-if="possibilities?.possibility" class='w-1/2 flex flex-col gap-2 font-thin w-full'>
          <div
v-for="memberIdx, index in possibilities.possibility" :key="index"
            class="flex-1 block font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
            {{ store.inputState.members[memberIdx]?.name }}
          </div>
        </div>
      </div>



      <div class="flex justify-between space-x-4">
        <UButton label="Back" @click="previousTab()" />
        <UButton type='submit' label="Save" />
      </div>
    </template>
  </UTabs>
</template>


<style>
.stepper div[role=tablist] {
  flex: auto;
  justify-content: space-between;
}
</style>