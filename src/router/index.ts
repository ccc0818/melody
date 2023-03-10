import { createRouter, createWebHistory } from "vue-router";
import { isLogin } from "@/service";

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
    name: "playlist",
    path: "/playlist/:pid",
    component: () => import("@/pages/PlayList.vue"),
  },
  {
    name: "recent",
    path: "/recent",
    component: () => import("@/pages/RecentPlay.vue"),
    meta: {
      needLogin: true,
    },
  },
  {
    name: "playcategory",
    path: "/playcategory",
    component: () => import("@/pages/PlaylistCategory.vue"),
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

router.beforeEach((to, from, next) => {
  const login = isLogin();

  if (to.name === "login" && login) {
    return;
  }

  if (!login && to.meta.needLogin) {
    // 未登录且路由需要登录权限
    next({ name: "login", query: { from: from.name as string } });
  } else {
    next();
  }
});

export default router;
