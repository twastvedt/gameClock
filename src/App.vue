<script setup lang="ts">
import { reactive, ref } from "vue";
import Clock from "./components/Clock.vue";
import draggable from "vuedraggable";

interface Player {
  name: string;
  time: number;
}

const additionalTime = 12.99;
const maximumTime = 90.99;

const state = reactive({
  drawer: false,
  paused: false,
  timers: [] as Player[],
  activeTimer: null as Player | null,
  editMode: false,
});

state.timers.push(
  ...Array.from(Array(4)).map((_, i) => ({
    name: `Player ${i + 1}`,
    time: additionalTime,
  }))
);

state.activeTimer = state.timers[0];
let start = Date.now();
let startTime = state.activeTimer?.time;
let nextBeep = 10;

function nextTurn(): void {
  if (state.activeTimer) {
    state.activeTimer.time = Math.min(
      state.activeTimer.time + additionalTime,
      maximumTime
    );

    state.activeTimer =
      state.timers[
        (state.timers.indexOf(state.activeTimer) + 1) % state.timers.length
      ];

    startTime = state.activeTimer.time;
    start = Date.now();
    nextBeep = 10;
  }
}

function pauseGame(): void {
  state.paused = !state.paused;

  if (!state.paused && state.activeTimer) {
    startTime = state.activeTimer.time;
    start = Date.now();
  }
}

function play(): void {
  setInterval(() => {
    if (!state.paused && state.activeTimer) {
      if (state.activeTimer.time <= 0.1) {
        state.activeTimer.time = 0;
        nextTurn();
        return;
      }

      if (state.activeTimer.time < nextBeep) {
        beep();
        console.log(`Beep! ${state.activeTimer.time}`);
        nextBeep -= nextBeep < 4 ? 0.5 : 1;
      }

      state.activeTimer.time = startTime - (Date.now() - start) / 1000;
    }
  }, 100);
}

const ding = ref<HTMLAudioElement>();

function beep(): void {
  ding.value?.play();
}

function clickMain(): void {
  if (state.editMode) {
    return;
  }

  if (state.paused) {
    nextTurn();
  }

  pauseGame();
}

function toggleEdit(): void {
  state.editMode = !state.editMode;

  if (state.editMode) {
    state.paused = true;
  }
}

function addPlayer(): void {
  state.timers.push({ name: "Player", time: additionalTime });
}

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.code) {
    case "Escape":
      pauseGame();
      break;

    case "Space":
      nextTurn();
      break;
  }
});

play();
</script>

<template>
  <v-app>
    <audio hidden="true" ref="ding">
      <source src="./assets/ding2.wav" type="audio/wav" />
    </audio>
    <v-app-bar>
      <v-app-bar-nav-icon @click="state.drawer = !state.drawer" />
      <v-spacer />
      <v-btn
        @click="pauseGame"
        dark
        elevation="2"
        raised
        :class="state.paused ? 'bg-error' : ''"
      >
        {{ state.paused ? "un" : "" }}pause
      </v-btn>
      <v-spacer />
      <v-btn @click="nextTurn" title="Next turn"
        ><v-icon>mdi-arrow-right</v-icon></v-btn
      >
      <v-btn
        @click="toggleEdit"
        dark
        :class="state.editMode ? 'bg-primary' : ''"
        title="Edit"
        ><v-icon>mdi-pencil</v-icon></v-btn
      >
    </v-app-bar>

    <v-navigation-drawer v-model="state.drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="main" @click="clickMain">
      <v-container class="fill-height players" fluid>
        <draggable
          class="v-row fill-height"
          v-model="state.timers"
          :disabled="!state.editMode"
        >
          <template #item="{ element }">
            <v-col cols="4">
              <Clock
                v-model:name="element.name"
                :time="element.time"
                :active="element === state.activeTimer"
              />
            </v-col>
          </template>

          <template #footer>
            <v-col cols="4" v-if="state.editMode">
              <v-card
                class="fill-height d-flex flex-column align-center justify-center elevation-0 newPlayerButton"
                @click="addPlayer"
              >
                +
              </v-card>
            </v-col>
          </template>
        </draggable>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.players .v-col {
  height: 50%;
}

.newPlayerButton {
  font-size: 150px;
  background: transparent;
  border: 1px dashed black;
}

.main {
  background-color: #cccccc;
}
</style>
