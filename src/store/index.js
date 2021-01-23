import { createStore } from "vuex";

import Pdf from "./Pdf";
import App from "./App";

const store = createStore({
  state() {
    return {};
  },
  mutations: {},
  actions: {},
  modules: {
    pdf: Pdf,
    app: App,
  },
});

export default store;
