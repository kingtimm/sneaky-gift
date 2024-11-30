<script setup lang="ts">
import TheLogo from './TheLogo.vue';
import type {NavigationMenuItem} from "#ui/types";

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

function selectHandler() {
  return drawerOpen.value = false
}

const {isSignedIn} = useAuth()

const getMenuItems = () => {
  let items: NavigationMenuItem[] = defaultMenuItems
  if (isSignedIn.value) {
    items = [...authMenuItems, ...defaultMenuItems]
  }
  return items.map((row) => {
    return {
      onSelect() {selectHandler()},
      ...row
    }
  })
}

const menuItems = ref(getMenuItems())

const drawerOpen = ref(false)

watch(isSignedIn, () => {
  menuItems.value = getMenuItems()
})

</script>

<template>
  <div class='max-w-2xl mx-auto flex items-center p-2 sticky justify-between'>
    <TheLogo class="w-1/5"/>
    <div class="flex gap-4 justify-end">
      <UNavigationMenu :items="menuItems" class="block max-sm:hidden"/>
      <UDrawer v-model:open="drawerOpen" title="Menu" direction="right" class="w-2/3">

        <UButton icon="i-lucide-menu" color="neutral" variant="ghost" class="sm:hidden" aria-text="Menu"/>
        <template #body>
          <UNavigationMenu orientation="vertical" :items="menuItems" class="z-10"/>
        </template>
      </UDrawer>
      <ClientOnly>
        <SignedOut>
          <SignInButton v-slot="props" mode="modal" class="cursor-pointer">
            <UButton v-bind="props" label="Sign In"/>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </ClientOnly>
    </div>
  </div>
</template>
