<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import TheLogo from './TheLogo.vue';

const defaultMenuItems =
  [] satisfies NavigationMenuItem[]

const authMenuItems = [{
  label: 'Lists',
  to: '/lists',
  icon: 'i-heroicons-numbered-list'
}] satisfies NavigationMenuItem[]

const { isSignedIn } = useAuth()

const getMenuItems = ()=>{
  if (isSignedIn.value) {
    return [...authMenuItems, ...defaultMenuItems, ]
  } else {
    return defaultMenuItems
  }
}
const menuItems = useState('menu-items', getMenuItems)


watch(isSignedIn, () => {
 menuItems.value = getMenuItems()
})

</script>

<template>
  <div class='flex items-center p-2 sticky justify-between'>
    <TheLogo class="w-1/5"/>
   <UNavigationMenu :items="menuItems" class="justify-center"/>
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
