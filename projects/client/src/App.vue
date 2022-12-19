<script setup></script>

<template>
  <v-app style="height: 100vh">
    <v-app-bar app> CLOCK </v-app-bar>
    <v-main>
      <v-container class="fill-height" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
