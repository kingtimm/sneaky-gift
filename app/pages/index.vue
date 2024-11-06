<template>
  <UContainer class="flex items-center flex-col gap-10 max-w-md">
      <h1 class="text-3xl text-tighter font-thin">Your Secret Santa recipient is...</h1>
      <RevealName />
      <p class="text-center">This is <UBadge>WIP</UBadge> to help your friend group randomly select one another for holiday gift giving</p>
      <UButton icon="i-heroicons-rocket-launch" size="xl" to="/create">Organize a Group</UButton>
  </UContainer>
</template>
