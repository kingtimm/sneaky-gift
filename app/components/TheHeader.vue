<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import TheLogo from './TheLogo.vue';

const menuItems = [
  [{
    label: 'Home',
    to: '/'
  }]
] satisfies NavigationMenuItem[][]

const authMenuItems = [{
  label: 'Lists',
  to: '/lists',
  icon: 'i-heroicons-numbered-list'
}] satisfies NavigationMenuItem[]

const menuItemsWithAuthed = computed(()=> {
  const auth = useAuth()
  if (auth.isLoaded && auth.isSignedIn) {
    const combinedList = [...menuItems]
    combinedList[0]?.push(...authMenuItems)
    return combinedList 
  } else {
    return menuItems
  }
})

</script>

<template>
  <div class='flex items-center p-2 sticky justify-between'>
    <TheLogo class="w-1/5"/>
    <!-- <UNavigationMenu :items="menuItemsWithAuthed" class="justify-center" /> -->
    <div class="w-1/5 flex justify-end">
      <ClientOnly>
        <SignedOut>
          <SignInButton mode="modal" class="cursor-pointer"/>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </ClientOnly>
    </div>
  </div>
</template>