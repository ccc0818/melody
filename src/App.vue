<script setup lang="ts">
import Aside from "@/components/CAside.vue";
import Header from "./components/CHeader.vue";
import useStore from "./store";
import { restoreCache } from "@/utils/cache";
import { useRouter } from "vue-router";
import {
  getLoginState,
  loginAsGuest,
  loginOut,
  markLogin,
  delLoginMark
} from "@/service";
import menuRouter from "./router/menu-router";
import { storeToRefs } from "pinia";

const router = useRouter();

// 初始化播放器状态 恢复状态
const { playerStore } = useStore();
const { initPlayerStore } = playerStore;
initPlayerStore();
restoreCache();

// 恢复用户状态
const { userStore } = useStore();
const { userState } = storeToRefs(userStore);
const { setUserState, setUserDetail } = userStore;
const user = computed<{ avatar: string; nickname: string }>(() => {
  return {
    avatar: userState.value.detail.avatar,
    nickname: userState.value.detail.nickname,
  };
});

onBeforeMount(async () => {
  const res = await getLoginState();
  
  if (res.data.code === 200 && res.data.profile) {
    // 已登录
    markLogin() // 标记已经登录

    setUserState({
      login: true,
      // uid: res.data.profile.userId,
    });

    setUserDetail({
      avatar: res.data.profile.avatarUrl,
      nickname: res.data.profile.nickname,
    });
  } else {
    delLoginMark(); // 删除登录标记
    loginAsGuest(); // 默认以访客登录
    setUserDetail({
      nickname: "游客模式",
    });
  }
});

function loginHandle() {
  if (!userState.value.login) {
    router.push({ name: "login" });
  }
}

async function logoutHandle() {
  const res = await loginOut(); // 请求注销
  console.log(res);
  delLoginMark()
  location.href = location.origin; // 重新加载网页
}
</script>

<template>
  <div class="app">
    <div class="header">
      <Header />
    </div>

    <div class="view">
      <!-- 侧边栏 -->
      <Aside
        class="aside"
        :router-list="menuRouter"
        :user="user"
        :login="userState.login"
        @login="loginHandle"
        @logout="logoutHandle"
      />
      <!-- 内容展示区 -->
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app {
  $aside-width: 200px;
  $header-height: 80px;
  height: 100%;
  display: flex;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $header-height;
    border-bottom: 1px solid var(--info-500);
    z-index: 99;
  }

  .view {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;

    .aside {
      width: $aside-width;
      height: 100%;
      padding-top: $header-height;
      flex-shrink: 0;
      border-right: 1px solid var(--info-500);
    }

    .content {
      flex: 1;
      height: 100%;
      overflow: auto;
      padding-top: $header-height;
    }
  }
}
</style>
