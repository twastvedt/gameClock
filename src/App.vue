<script setup lang="ts">
import { reactive } from "vue";
import Clock from "./components/Clock.vue";
interface Timer {
  name: string;
  time: number;
}

const timers: Timer[] = reactive([]);
const defaultStart = 45;
const additionalTime = 45;
const maximumTime = 119;

timers.push({ name: "Trygve", time: defaultStart });
timers.push({ name: "Sonja", time: defaultStart });
timers.push({ name: "Solvejg", time: defaultStart });
timers.push({ name: "Ross", time: defaultStart });
timers.push({ name: "Bjørn", time: defaultStart });
timers.push({ name: "Adam", time: defaultStart });

let activeIndex = 0;
let activeTimer = timers[0];
let start = Date.now();
let startTime = activeTimer.time;
let paused = false;

function changeTurn(index: number): void {
  activeTimer = timers[index];
}

function nextTurn(): void {
  activeIndex = (activeIndex + 1) % timers.length;
  activeTimer = timers[activeIndex];
  activeTimer.time = Math.min(activeTimer.time + additionalTime, maximumTime);

  startTime = activeTimer.time;
  start = Date.now();
}

function pauseGame(): void {
  paused = !paused;

  if (!paused) {
    startTime = activeTimer.time;
    start = Date.now();
  }
}

function play(): void {
  setInterval(() => {
    if (!paused) {
      activeTimer.time = startTime - (Date.now() - start) / 1000;
    }
  }, 1000);
}

play();
</script>

<template>
  <button @click="nextTurn">next turn</button>
  <button @click="pauseGame">{{ paused ? "un" : "" }}pause</button>
  <main>
    <Clock v-for="timer in timers" :name="timer.name" :time="timer.time" />
  </main>
</template>

<style>
@import "./assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
