<script setup lang="ts">
useSeoMeta({
  title: 'sneaky gift',
  description: 'A Gift Exchange App to share with friends',
})

useHeadSafe({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    }
  ]
})

</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
      <UToaster/>
    </NuxtLayout>
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

input[type="text"],
input[type="number"],
input[type="email"],
input[type="tel"],
input[type="password"] {
  font-size: 16px;
}

</style>
