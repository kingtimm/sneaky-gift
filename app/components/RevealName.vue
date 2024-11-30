<template>
  <div class="flex items-center">
    <div
      class=" flex h-20 min-w-48  items-center justify-center text-white">
      <Transition appear mode="out-in">
        <div v-if="!revealed" class="present-background rounded-l-xl w-full h-full"/>
        <div v-else class="text-black dark:text-white">
          <RandomName v-if="!name "/>
          <p v-else>{{ name }}</p>
        </div>
      </Transition>
    </div>
    <UButton class="h-20 rounded-r-xl rounded-l-none opacity-80 bg-red-950" v-bind="computedProps" @click="revealName()"/>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  name?: string
}>()

const revealed = useState(()=> false)

function revealName() {
  revealed.value = !revealed.value
}

const computedProps = computed(() => {
  return {
    label: revealed.value ? 'Reveal' : 'Reveal',
    icon: revealed.value ? 'i-lucide-eye-off' : 'i-lucide-eye',

  }
})


</script>

<style scoped>
@property --wipe-position {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}

.v-enter-active {
  --wipe-position: 100%;
  --gradient-length: 20%;
  mask-image: linear-gradient(
    to bottom right,
    black var(--wipe-position),
    transparent calc(var(--wipe-position) + var(--gradient-length)),
    transparent
  );
  transition: --wipe-position 600ms cubic-bezier(0, 0.55, 0.45, 1);
}

.v-enter-from {
  --wipe-position: calc(-1 * var(--gradient-length));
}

.present-background {
  --stripe1: var(--ui-color-primary-950);
  --stripe2: var(--color-white);
  background: repeating-linear-gradient(
    45deg,
    var(--stripe1),
    var(--stripe1) 10px,
    var(--stripe2) 10px,
    var(--stripe2) 20px
  );
}

</style>

