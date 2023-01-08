<script setup>
import Menu from "./components/Menu.vue";

const footer = `${new Date(BUILD_DATE).toLocaleString()} | GIT_SHA`;
</script>

<template>
  <v-app class="app">
    <Menu />
    <v-main class="bg-grey-lighten-3">
      <v-container class="fill-height" fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer
      class="flex-grow-0 bg-grey-lighten-3 text-caption text-grey-darken-1"
      >{{ footer }}</v-footer
    >
  </v-app>
</template>
<style>
.app {
  height: 100vh;
}
</style>
