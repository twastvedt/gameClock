<script setup>
import Menu from "./components/Menu.vue";
</script>

<template>
  <v-app style="height: 100vh">
    <Menu />
    <v-main>
      <v-container class="fill-height" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<style>
.v-main {
  background-color: #cccccc;
}
</style>
