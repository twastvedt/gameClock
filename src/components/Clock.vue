<script setup lang="ts">
defineProps<{
  time: number;
  name: string;
}>();
</script>

<template>
  <h1>{{ name }}</h1>
  <h3>
    {{ Math.floor(time / 60) }}:{{
      Math.floor(time % 60)
        .toString()
        .padStart(2, "0")
    }}
  </h3>
</template>

<style scoped></style>
