<script setup lang="ts">
import { ref } from "vue";
import Clock from "./components/Clock.vue";
import draggable from "vuedraggable";
import { useStore } from "../store";

const store = useStore();

store.connect();

let nextBeep = 10;

function play(): void {
  setInterval(() => {
    const time = store.game.update();

    if (time !== undefined) {
      store.activeTime = time;

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
  if (store.editMode) {
    return;
  }

  if (store.game.paused) {
    store.game.nextTurn();
  }

  store.game.pause();
}

function addPlayer(): void {
  store.game.players.push({
    name: "Player",
    time: store.game.settings.addTime,
  });
}

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.code) {
    case "Escape":
      store.game.pause();
      break;

    case "Space":
      store.game.nextTurn();
      break;
  }
});

play();
</script>

<template>
  <audio hidden="true" ref="ding">
    <source src="./assets/ding2.wav" type="audio/wav" />
  </audio>
  <draggable
    @click="clickMain"
    class="v-row fill-height main"
    v-model="store.game.players"
    :disabled="!store.editMode"
    item-key="name"
  >
    <template #item="{ element, index }">
      <v-col cols="4">
        <Clock
          v-model:name="element.name"
          :time="
            index === store.game.activeIndex ? store.activeTime : element.time
          "
          :active="index === store.game.activeIndex"
        />
      </v-col>
    </template>

    <template #footer>
      <v-col cols="4" v-if="store.editMode">
        <v-card
          class="fill-height d-flex flex-column align-center justify-center elevation-0 newPlayerButton"
          @click="addPlayer"
        >
          +
        </v-card>
      </v-col>
    </template>
  </draggable>
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
