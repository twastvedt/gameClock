<script setup lang="ts">
import { useStore } from "../store";

const store = useStore();

store.connect();

function toggleEdit(): void {
  store.editMode = !store.editMode;

  if (store.editMode) {
    store.game.paused = true;
  }
}
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click="store.drawer = !store.drawer" />
    <v-spacer />
    <v-btn
      @click="store.game.pause"
      dark
      elevation="2"
      raised
      :class="store.game.paused ? 'bg-error' : ''"
    >
      {{ store.game.paused ? "un" : "" }}pause
    </v-btn>
    <v-spacer />
    <v-btn @click="store.game.nextTurn" title="Next turn"
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

  <v-navigation-drawer v-model="store.drawer" absolute temporary>
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
</template>
