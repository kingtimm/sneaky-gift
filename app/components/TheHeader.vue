<script setup lang="ts">
import TheLogo from './TheLogo.vue';
import type { NavigationMenuItem } from "#ui/types";

const defaultMenuItems =
  [{
    label: 'About',
    to: '/about',
  },] satisfies NavigationMenuItem[]

const authMenuItems = [{
  label: 'Lists',
  to: '/lists',
},

] satisfies NavigationMenuItem[]

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
  <div class='max-w-2xl mx-auto flex items-center p-2 sticky justify-between'>
    <TheLogo class="w-1/5"/>
    <div class="flex gap-4 justify-end">
   <UNavigationMenu :items="menuItems" class="block max-sm:hidden"/>
      <UDropdownMenu :items="menuItems"  >
        <UButton icon="i-lucide-menu" color="neutral" variant="outline" class="sm:hidden" />
      </UDropdownMenu>
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
