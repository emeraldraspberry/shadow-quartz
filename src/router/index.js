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
    path: "/viewer/:referredPath",
    name: "Viewer.get",
    props: true,
    component: () =>
      import(/* webpackChunkName: "viewer" */ "../views/Viewer.vue"),
  },
  {
    path: "/viewer",
    name: "Viewer",
    component: () =>
      import(/* webpackChunkName: "viewer" */ "../views/Viewer.vue"),
  },
  {
    path: "/shadows",
    name: "Shadows",
    component: () =>
      import(/* webpackChunkName: "shadows" */ "../views/Shadows.vue"),
  },
  {
    path: "/library",
    name: "Library",
    component: () =>
      import(/* webpackChunkName: "library" */ "../views/Library.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
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
