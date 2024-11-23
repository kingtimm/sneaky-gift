<script setup lang="ts">
  import {useSecretSantaListStore} from "#imports";

  const { inputState } = storeToRefs(useSecretSantaListStore())
  const { id } = storeToRefs(useUserEntitlementsStore())

  const notice = computed(()=>{
    return inputState.value.id ? `Editing ${inputState?.value.name}` : `Creating ${inputState?.value.name}`
  })
</script>

<template>
<p class="text-neutral-600 text-sm text-right">{{ notice }}</p>
</template>

<style scoped>

</style>
