<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import type { z } from 'zod'
import { ListInsertShape } from '~~/shared/types/lists';

const schema = ListInsertShape.pick({
  name: true
})

type Schema = z.output<typeof schema>

const inputState = reactive<Partial<Schema>>({
  name: undefined
})

const fetchFn = useRequestFetch()

const { data: lists, refresh, isLoading } = useQuery({
  key: ['lists'],
  query: () => fetchFn('/api/lists'),
})

const toast = useToast()
async function onSubmit(_event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'Created new List', color: 'success' })
  await $fetch('/api/lists', { method: 'post', body: inputState })
  await refresh()
}

</script>

<template>
  <div>
    <h1 class="text-xl">Your Lists</h1>
    <p v-if="isLoading">loading</p>
    <div v-else v-for="(item, index) in lists" :key='index'>
      <UCard>
        <template #header>
          {{ item.name }}
        </template>

        {{ item.members }} members

        <template #footer>
          <UButton :to="`/create/1-name/${item.id}`" icon="i-heroicons-pencil" label="Edit"></UButton>
        </template>
      </UCard>
    </div>
    <h1 class="text-xl">Add New</h1>
    <UForm :schema="schema" :state="inputState" class="space-y-4" @submit="onSubmit">
      <UFormField label="Name" name="name">
        <UInput v-model="inputState.name" />
      </UFormField>
      <UButton type='submit' label="New List" icon="i-heroicons-plus-circle" />
    </UForm>
  </div>
</template>
