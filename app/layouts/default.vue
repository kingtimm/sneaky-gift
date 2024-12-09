<template>
  <div>
    <TheHeader/>
    <UContainer class="max-w-2xl p-8">
      <slot/>
    </UContainer>
    <TheFooter/>
  </div>
</template>

<script setup lang="ts">
defineOgImageComponent('Main', {
  title: 'Is this thing on?'
})</script>
