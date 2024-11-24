<template>
  <div class="space-y-4">
    <div class="flex gap-x-2">
      <h1 class="text-xl">Your Lists</h1>
      <UButton type='submit' label="New List" icon="i-lucide-plus" to="/create"/>
    </div>
    <p v-if="isLoading">loading</p>
    <div v-else class="flex gap-2">
      <UCard v-for="(item, index) in lists" :key='index'>
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold">
              {{ item.name }}
            </h1>
            <div class="flex gap-1.5 items-center">

              {{ item.membersLength }}
              <UIcon name="i-lucide-users" class="w-3.5 h-3.5"/>
            </div>
          </div>
        </template>

        <p>
          Members: {{ item.members.map(row=>row.name).join(", ") }}
        </p>

        <template #footer>
          <div class="flex gap-2">

            <UButton icon="i-lucide-trash" label="Delete" @click="deleteListItem(item.id)"/>
            <UButton :to="`/create/1-name/${item.id}`" icon="i-lucide-pencil" label="Edit"/>
          </div>
        </template>
      </UCard>
    </div>
    <NoListsYetAlert v-if="lists?.length === 0"/>
  </div>
</template>


<script setup lang="ts">

const fetchFn = useRequestFetch()

const {data: lists, refetch, isLoading} = useQuery({
  key: ['lists'],
  query: () => fetchFn('/api/lists'),
})

const toast = useToast()

// type MemberList = typeof lists.value[0]
//
// async function getMemberJoin(mList: MemberList) {
//
// }

const {mutate: deleteListItem} = useMutation({
  mutation: (id: string) => fetchFn(`/api/lists/${id}`, {
    method: 'delete',
  }),
  onSettled: async () => {
    toast.add({
      title: `Deleted`,
      description: ''
    })
    await refetch()
  }
})

</script>

