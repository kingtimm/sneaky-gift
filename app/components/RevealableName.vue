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
    class="flex-1 bg-[var(--ui-bg-elevated)] p-2 flex justify-between items-center rounded"
  >
    <Transition appear>
      <div
        v-if="revealed"
        class="flex items-center font-thin"
        @click="revealName()"
      >
        {{ name }}
      </div>
    </Transition>
    <UButton
      v-if="!revealed"
      icon="i-lucide-eye" variant="link" size="xs" label="Show"
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

</style>

