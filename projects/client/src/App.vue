<script setup lang="ts">
import { reactive, ref } from "vue";
import Clock from "./components/Clock.vue";
import draggable from "vuedraggable";
import { Game } from "../../common/src/Game";

const state = reactive({
  drawer: false,
  game: Game.makeDefault(),
  editMode: false,
  activeTime: 0,
});

let nextBeep = 10;

function play(): void {
  setInterval(() => {
    const time = state.game.update();

    if (time !== undefined) {
      state.activeTime = time;

      if (time < nextBeep) {
        beep();
        console.log(`Beep! ${time}`);
        nextBeep -= nextBeep < 4 ? 0.5 : 1;
      }
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

  if (state.game.paused) {
    state.game.nextTurn();
  }

  state.game.pause();
}

function toggleEdit(): void {
  state.editMode = !state.editMode;

  if (state.editMode) {
    state.game.paused = true;
  }
}

function addPlayer(): void {
  state.game.players.push({
    name: "Player",
    time: state.game.settings.addTime,
  });
}

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.code) {
    case "Escape":
      state.game.pause();
      break;

    case "Space":
      state.game.nextTurn();
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
        @click="state.game.pause"
        dark
        elevation="2"
        raised
        :class="state.game.paused ? 'bg-error' : ''"
      >
        {{ state.game.paused ? "un" : "" }}pause
      </v-btn>
      <v-spacer />
      <v-btn @click="state.game.nextTurn" title="Next turn"
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
          v-model="state.game.players"
          :disabled="!state.editMode"
          item-key="name"
        >
          <template #item="{ element, index }">
            <v-col cols="4">
              <Clock
                v-model:name="element.name"
                :time="
                  index === state.game.activeIndex
                    ? state.activeTime
                    : element.time
                "
                :active="index === state.game.activeIndex"
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
