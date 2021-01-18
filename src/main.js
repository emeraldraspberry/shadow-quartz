import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";
import "material-design-icons/iconfont/material-icons.css";

const app = createApp({
  render: () => h(App),
});

new WaveUI(app, {
  // Wave UI options
  iconLigatures: "material-icons",
});

app
  .use(store)
  .use(router)
  .mount("#app");
