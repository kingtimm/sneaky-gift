<script setup lang="ts">
/**
 * @credits @arashsheyda <https://github.com/arashsheyda>
 */

withDefaults(defineProps<{
  title?: string
  description?: string
  bg?: string
  icon?: string
  logo?: string
  image?: string
  username?: string
}>(), {
  bg: 'linear-gradient(to bottom right, #171717, #131313)',
})
</script>

<template>
  <div
    class="relative h-full w-full flex items-center justify-center bg-neutral-900 text-white border-2 border-white"
    :style="{ backgroundImage: bg }"
  >
    <div
      v-if="image"
      class="absolute inset-0 w-full h-full bg-center opacity-10"
      :style="{ backgroundImage: `url(${image})` }"
    />
    <div class="flex flex-col items-center text-center">
      <div
        class="flex gap-0 justify-center items-center text-6xl font-bold tracking-tighter whitespace-nowrap"
      >
        <Icon name="i-lucide-venetian-mask" mode="svg" class="text-6xl mr-2 text-red-600"/>
        sneaky<span class="text-red-600">.</span>gift
      </div>
      <p class="text-2xl max-w-3xl">
        {{ description }}
      </p>
    </div>
<!--    <div-->
<!--      class="w-3/4 h-18 rounded-xl" :style="-->
<!--    {-->
<!--      background: `repeating-linear-gradient(45deg,oklch(.704 .191 22.216),oklch(.704 .191 22.216) 10px,rgb(255, 255, 255) 10px,rgb(255, 255, 255) 20px)`-->
<!--    }">-->
<!--      -->
<!--    </div>-->
  </div>
</template>

