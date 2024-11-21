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

const { data:deleteList } = useMutation({
  mutation: (id: string) => fetchFn(`/api/lists/${id}`),
  onSettled: () => refresh()
})

</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-x-2">
    <h1 class="text-xl">Your Lists</h1>
    <UButton type='submit' label="New List" icon="i-lucide-plus" to="/create" />
    </div>
    <p v-if="isLoading">loading</p>
    <div v-else class="flex gap-2">
      <UCard  v-for="(item, index) in lists" :key='index'>
        <template #header>
          {{ item.name }}
        </template>

        {{ item.members }} members

        <template #footer>
          <div class="flex gap-2">

          <UButton @click="deleteList(item.id)" icon="i-lucide-trash" label="Delete"></UButton>
          <UButton :to="`/create/1-name/${item.id}`" icon="i-lucide-pencil" label="Edit"></UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
