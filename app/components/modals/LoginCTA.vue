<script setup lang="ts">
import { SignInButton } from 'vue-clerk'
defineProps<{redirectUrl?: string}>()
const modal = useModal()
</script>

<template>
  <UModal title="Log in" >

    <template #body>
      <div class="flex flex-col mx-auto ps-4">
        Sign in to save your secret santa and enjoy features such as:
        <ul class="list-disc p-5">
          <li>Sharing</li>
          <li>Blind Drawing</li>
          <li>and more</li>
        </ul>
        <SignInButton v-slot="props" as-child class="flex-none" mode="modal" :force-redirect-url="redirectUrl">
          <UButton v-bind="props" label="Sign In" size="lg" @click="modal.close(); props.handler();"/>
        </SignInButton>
      </div> 
    </template>
  </UModal>
</template>