<template>
  <div v-if='store.inputState.members.length > 1'>
    <div>
      <h1 class="mt-5 text-xl">Prevent Pairings</h1>
      <p class="font-extralight">Any secret santa pairings we should prevent?</p>
      <PreventPairingSelect :members="store.inputState.members" />
      <div v-if="store.exclusionsAsName">
        <h1 class="mt-5 text-xl">Rules</h1>
        <div class="py-3 grid gap-2 font-thin w-full">
          <div
v-for="[member1, member2], i in store.exclusions" :key="i"
            class="font-thin bg-neutral-800 p-2 flex justify-between items-center rounded">
            <div>
              <UBadge color="neutral" variant="outline">
                {{ store.inputState.members[member1]?.name }}
              </UBadge>
              will not gift for
              <UBadge color="neutral" variant="outline">
                {{ store.inputState.members[member2]?.name }}
              </UBadge>
            </div>
            <UButton variant="soft" label="Remove"  @click="remove(member1,member2)"/>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

const props = defineProps<{ items: TabsItem[], index: number }>()

const store = useSecretSantaListStore()

function remove(memberIdx: number, exclusionIdx: number) {
  const newExclusionList: number[] = []
  if (store.inputState.members[memberIdx]?.exclusions) {
    newExclusionList.concat(store.inputState.members[memberIdx].exclusions.filter(row => row === exclusionIdx))
    store.inputState.members[memberIdx].exclusions = newExclusionList
  }
}

</script>