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

@theme {
  --color-primary-50: var(--ui-color-primary-50);
  --color-primary-100: var(--ui-color-primary-100);
  --color-primary-200: var(--ui-color-primary-200);
  --color-primary-300: var(--ui-color-primary-300);
  --color-primary-400: var(--ui-color-primary-400);
  --color-primary-500: var(--ui-color-primary-500);
  --color-primary-600: var(--ui-color-primary-600);
  --color-primary-700: var(--ui-color-primary-700);
  --color-primary-800: var(--ui-color-primary-800);
  --color-primary-900: var(--ui-color-primary-900);
  --color-primary-950: var(--ui-color-primary-950);
  --font-family-display: "Lilita One", "sans-serif";
}


input[type="text"],
input[type="number"],
input[type="email"],
input[type="tel"],
input[type="password"] {
  font-size: 16px;
}

</style>
