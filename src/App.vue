<script setup lang="ts">
import { reactive } from "vue";
import Clock from "./components/Clock.vue";
interface Timer {
  name: string;
  time: number;
}

const timers: Timer[] = reactive([]);
const additionalTime = 45.99;
const maximumTime = 119.99;

timers.push({ name: "Trygve", time: additionalTime });
timers.push({ name: "Sonja", time: additionalTime });
timers.push({ name: "Solvejg", time: additionalTime });
timers.push({ name: "Ross", time: additionalTime });
timers.push({ name: "Bjørn", time: additionalTime });
timers.push({ name: "Adam", time: additionalTime });

let state = reactive({ activeIndex: 0 });
let activeTimer = timers[0];
let start = Date.now();
let startTime = activeTimer.time;
let paused = false;

function nextTurn(): void {
  activeTimer.time = Math.min(activeTimer.time + additionalTime, maximumTime);

  state.activeIndex = (state.activeIndex + 1) % timers.length;
  activeTimer = timers[state.activeIndex];

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
      if (activeTimer.time <= 0.1) {
        activeTimer.time = 0;
        nextTurn();
        return;
      }
      activeTimer.time = startTime - (Date.now() - start) / 1000;
    }
  }, 100);
}

play();
</script>

<template>
  <v-app>
    <v-toolbar>
      <v-btn @click="nextTurn">next turn</v-btn>
      <v-btn @click="pauseGame">{{ paused ? "un" : "" }}pause</v-btn>
    </v-toolbar>
    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="(timer, i) in timers" :key="i" cols="4">
            <Clock
              :name="timer.name"
              :time="timer.time"
              :active="i === state.activeIndex"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
