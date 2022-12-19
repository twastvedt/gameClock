import { createRouter, createWebHistory } from "vue-router";
import Game from "./components/Game.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Game,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
