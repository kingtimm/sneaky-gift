<script setup lang="ts">

import type {NavigationMenuItem} from "@nuxt/ui";

const items = ref([
  {
    icon: "i-lucide-github",
    label: "GitHub",
    to: 'https://github.com/kingtimm/secret-santa-is'
  }, {
    icon: "i-simple-icons:bluesky",
    label: "@timk.ing",
    to: 'https://bsky.app/profile/timk.ing'
  },


] satisfies NavigationMenuItem[])

</script>

<template>
    <UNavigationMenu :items="items" class="flex items-center justify-center">/>
  </unavigationmenu>
</template>

<style scoped>

</style>
