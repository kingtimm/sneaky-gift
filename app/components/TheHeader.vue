<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import TheLogo from './TheLogo.vue';

const menuItems = ref([
  [{
    label: 'Home',
    to: '/'
  }]
] satisfies NavigationMenuItem[][])

const authMenuItems = [{
  label: 'Lists',
  to: '/lists',
  icon: 'i-heroicons-numbered-list'
}] satisfies NavigationMenuItem[]

const { isSignedIn, } = useAuth()

watch([isSignedIn], () => {
  if (isSignedIn && menuItems.value[0]) {
    menuItems.value[0].push(...authMenuItems)
  }
}, { immediate: true })

</script>

<template>
  <div class='flex items-center p-2 sticky justify-between'>
    <TheLogo class="w-1/5"/>
     <UNavigationMenu :items="menuItems" class="justify-center" />
    <div class="w-1/5 flex justify-end">
      <ClientOnly>
        <SignedOut>
          <SignInButton v-slot="props" mode="modal" class="cursor-pointer">
            <UButton v-bind="props" label="Sign In" />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </ClientOnly>
    </div>
  </div>
</template>
