<script setup lang="ts">
const props = defineProps<
  {
    name: string,
    triggerAll: boolean,
  }

>()
const revealed = defineModel<boolean>({default: false, required: false})

// if the parent tells us that all shall be revealed :)
if (props.triggerAll) {
  revealName()
}

function revealName() {
  revealed.value = !revealed.value
}

</script>

<template>
  <div
    class="flex-1 h-12 px-2 py-1 flex justify-between items-center"
  >
    <Transition appear mode="out-in">
      <div
        v-if="!revealed"
        class="present-background w-full h-full rounded-l-sm text-xs"/>
      <div
        v-else
        class="flex items-center rounded-l-sm w-full h-full font-thin bg-[var(--ui-bg-elevated)] px-3"
        @click="revealName()"
      >
        {{ name }}
      </div>
    </Transition>
    <UButton
      icon="i-lucide-eye" class="rounded-l-none h-10" aria-text="Show recipient name"
      @click="revealName()"/>
  </div>
</template>

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
  --stripe1: var(--ui-primary);
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

