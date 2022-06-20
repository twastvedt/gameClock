<script setup lang="ts">
const props = defineProps<{
  time: number;
  name: string;
  active: boolean;
}>();

function formatTime(time: number): string {
  let displayTime;
  if (time < 10) {
    displayTime = `
        ${Math.floor(time)}.${Math.floor((time - Math.floor(time)) * 100)
      .toString()
      .padStart(2, "0")}`;
  } else {
    displayTime = `
        ${Math.floor(time / 60)}:${Math.floor(time % 60)
      .toString()
      .padStart(2, "0")}`;
  }
  return displayTime;
}
</script>

<template>
  <v-card :dark="active" :color="active ? 'primary' : 'default'">
    <v-card-text>
      <h1 style="font-size: 90px; line-height: 120px">
        {{ formatTime(time) }}
      </h1>
      <h1 style="font-size: 60px; line-height: 80px">{{ name }}</h1>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>

