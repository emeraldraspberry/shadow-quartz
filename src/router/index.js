import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Viewer",
    name: "viewer",
    component: () =>
      import(/* webpackChunkName: "viewer" */ "../views/Viewer.vue"),
  },
  {
    path: "/Shadows",
    name: "shadows",
    component: () =>
      import(/* webpackChunkName: "shadows" */ "../views/Shadows.vue"),
  },
  {
    path: "/Library",
    name: "library",
    component: () =>
      import(/* webpackChunkName: "library" */ "../views/Library.vue"),
  },
  {
    path: "/Settings",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
  },
];

const router = createRouter({
  history: process.env.IS_ELECTRON
    ? createWebHashHistory()
    : createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
