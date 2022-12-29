<script setup lang="ts">
import { computed, ref } from "vue";
import Clock from "./Clock.vue";
import draggable from "vuedraggable";
import { useStore } from "../store";
import { useRoute } from "vue-router";
import { Player } from "../../../common/src/Player";

const store = useStore();

const route = useRoute();

if (route.meta.local) {
  store.setLocal();
} else {
  const room = route.params.room;

  if (typeof room === "string") {
    store.setRoom(room);
  } else {
    store.setRoom();
  }
}

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
    store.nextTurn();
  }

  store.setPause(true);
}

const players = computed({
  get() {
    return store.game.order.map((id) => store.game.players[id] as Player);
  },
  set(newValue) {
    store.changeOrder(newValue.map((v) => v.id));
  },
});

window.addEventListener("keyup", (event: KeyboardEvent) => {
  switch (event.code) {
    case "Escape":
      store.setPause();
      break;

    case "Space":
      event.preventDefault();
      store.nextTurn();
      break;
  }
});

play();
</script>

<template>
  <audio hidden="true" ref="ding">
    <source src="../assets/ding2.wav" type="audio/wav" />
  </audio>
  <draggable
    @click="clickMain"
    class="v-row fill-height"
    v-model="players"
    :disabled="!store.editMode"
    item-key="id"
  >
    <template #item="{ element }">
      <v-col cols="4">
        <Clock
          v-model:name="element.name"
          @update:name="store.updatePlayer(element)"
          :time="
            element.id === store.game.activeId ? store.activeTime : element.time
          "
          :active="element.id === store.game.activeId"
          :editable="store.editMode"
        />
      </v-col>
    </template>

    <template #footer>
      <v-col cols="4" v-if="store.editMode">
        <v-card
          class="fill-height d-flex flex-column align-center justify-center elevation-0 newPlayerButton"
          @click="store.addPlayer()"
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
</style>
