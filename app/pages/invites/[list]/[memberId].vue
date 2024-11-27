<script setup lang="ts">

function throwError() {
  throw createError({
    statusMessage: "Cannot load"
  })
}

const { list, memberId } = useRoute().params

if (!list && !memberId) {
  throwError()
}

const fetchFn = useRequestFetch()
const { data, ...rest } = useQuery({
  key: ()=> [`${list}`, `${memberId}`],
  query: ()=> fetchFn(`/api/invites/${list}/${memberId}`),
})
</script>

<template>
<pre>
  {{ data }}
</pre>
</template>

<style scoped>

</style>
