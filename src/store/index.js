import { createStore } from "vuex";

import Pdf from "./Pdf";

const store = createStore({
  state() {
    return {};
  },
  mutations: {},
  actions: {},
  modules: {
    pdf: Pdf,
  },
});

export default store;
