import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";
import { createApp, markRaw } from "vue";
import { router } from "./router";

loadFonts();

const pinia = createPinia().use(() => ({
  router: markRaw(router),
}));

createApp(App).use(vuetify).use(pinia).use(router).mount("#app");
