<script setup lang="ts">
import { useStore } from "../store";

const store = useStore();

function toggleEdit(): void {
  store.editMode = !store.editMode;

  if (store.editMode) {
    store.setPause(true);
  }
}
</script>

<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="store.drawer = !store.drawer" />
    <v-spacer />
    <v-btn
      @click="() => store.setPause()"
      dark
      elevation="2"
      raised
      :class="store.game.paused ? 'bg-error' : ''"
    >
      {{ store.game.paused ? "un" : "" }}pause
    </v-btn>
    <v-spacer />
    <v-btn @click="store.nextTurn" title="Next turn"
      ><v-icon>mdi-arrow-right</v-icon></v-btn
    >
    <v-btn
      @click="toggleEdit"
      dark
      :class="store.editMode ? 'bg-primary' : ''"
      title="Edit"
      ><v-icon>mdi-pencil</v-icon></v-btn
    >
  </v-app-bar>

  <v-navigation-drawer v-model="store.drawer">
    <v-list>
      <v-list-item title="Home" />
      <v-list-item title="Account" />
    </v-list>
  </v-navigation-drawer>
</template>
