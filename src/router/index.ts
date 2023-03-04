import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "home",
    path: "/",
    component: () => import("@/pages/Home.vue"),
  },
  {
    name: "collection",
    path: "/collection",
    component: () => import("@/pages/Collection.vue"),
    meta: {
      needLogin: true,
    },
  },
  {
    name: "search",
    path: "/search/:s",
    component: () => import("@/pages/Search.vue"),
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/pages/Login.vue"),
  },
  {
    name: "not found",
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
