<template>
  <UContainer class="flex items-center flex-col gap-10 max-w-md">
    <BackgroundSnowfallBg
      color="ADD8E6"
      class="absolute min-h-screen inset-0 z-[-3]"
      :min-radius="0.2"
      :max-radius="5"
      :speed="0.5"
    />

    <h1 class="text-3xl text-center text-tighter font-display">Your sneaky gift goes to...</h1>
    <RevealName/>
    <div class="flex flex-col gap-4 rounded-xl bg-[var(--ui-bg-elevated)]/80 py-8 px-3 items-center">
      <p class="text-center font-display">Spread love and cheer among a <strong>group</strong> of generous gift givers this holiday
        season</p>
      <p>🎅🕎🎁</p>
    <UButton trailing-icon="i-lucide-arrow-right" class="" size="xl" to="/create">Organize a Group</UButton>
    </div>
  </UContainer>
</template>
<script setup lang="ts">
</script>
