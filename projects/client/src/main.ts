import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";
import type { Router } from "vue-router";
import { createApp, markRaw } from "vue";
import { router } from "./router";

loadFonts();

declare module "pinia" {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

const pinia = createPinia().use(() => ({
  $router: markRaw(router),
}));

createApp(App).use(vuetify).use(router).use(pinia).mount("#app");
