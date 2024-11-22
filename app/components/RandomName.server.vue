<template>
  <p class="text-2xl font-bold">
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
  'BFF',
  'Team mate',
  'Wingman',
  'Partner',
  'SO',
  'Doug',
  'Carrie',
  'Ray',
  'Homer',
  'John',
  'Lydia',
  'Katherine',
  'Grandma',
  'Grandpa'
]

const name = names[Math.floor(Math.random()*names.length)]

</script>
