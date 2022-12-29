import { createRouter, createWebHistory } from "vue-router";
import Game from "./components/Game.vue";

const routes = [
  {
    path: "/local",
    name: "local",
    component: Game,
    meta: {
      local: true,
    },
  },
  {
    path: "/",
    redirect: "/local",
  },
  {
    path: "/room/:room?",
    name: "room",
    component: Game,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
