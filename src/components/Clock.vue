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
  <v-card
    :dark="active"
    :color="active ? 'primary' : 'default'"
    class="fill-height"
  >
    <v-card-text>
      <h1 class="title">
        {{ formatTime(time) }}
      </h1>
      <h2 class="subtitle">{{ name }}</h2>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.title {
  font-size: 90px;
  line-height: 120px;
}

.subtitle {
  font-size: 60px;
  line-height: 80px;
}
</style>
