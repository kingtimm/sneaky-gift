<template>
  <p class="text-xl font-bold">
    {{ name }}
  </p>
</template>

<script setup lang="ts">

const names = [
  'Mom',
  'Dad',
  'Hermano',
  'Little Brother',
  'Big Sis',
  'Boss',
  'Team mate',
  'Wingman',
  'Partner',
  'SO',
  'Doug',
  'Carrie'
]

const name = names[Math.floor(Math.random()*names.length)]

</script>