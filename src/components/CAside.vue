<script setup lang="ts">
import UserImg from "@/assets/images/user-default.png";
import { useRouter } from "vue-router";

const router = useRouter();

const props = withDefaults(
  defineProps<{
    routerList: Array<{ name: string; to: object } | undefined>;
    user: { avatar: string; nickname: string };
    login: boolean;
  }>(),
  {
    routerList: () => [],
    user: () => ({
      avatar: UserImg,
      nickname: "未登录",
      login: true,
    }),
  }
);

const emits = defineEmits<{
  (e: "login"): void;
  (e: "logout"): void;
}>();
</script>

<template>
  <div class="aside-container">
    <!--  路由控制 -->
    <div class="router">
      <span class="iconfont icon-houtui" @click="router.back()"></span>
      <span class="iconfont icon-qianjin" @click="router.forward()"></span>
    </div>

    <!-- 用户 -->
    <div class="user" :class="login ? 'show-logout' : ''" @click="emits('login')">
      <img class="avatar" :src="user.avatar ? user.avatar : UserImg" />
      <p class="name">{{ user.nickname ? user.nickname : "未登录" }}</p>
      <span
        class="iconfont icon-a-icon_tuichudengchu logout"
        @click.stop="emits('logout')"
      >注销</span>
    </div>

    <ul class="menu">
      <li v-for="(v, i) of routerList" :key="i">
        <RouterLink :to="v!.to">{{ v!.name }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.aside-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .router {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 20px;

    .iconfont {
      font-size: 2em;
      font-weight: 800;
      margin: 0 20px;
      user-select: none;
      cursor: pointer;
      padding: 5px;
      transition: 0.1s;

      &:hover {
        background-color: var(--primary);
        color: #fff;
        border-radius: 8px;
      }

      &:active{
        transform: scale(.8);
      }
    }
  }

  .user {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    margin: 0 0 20px 0;
    cursor: pointer;
    position: relative;
    transition: .3s;

    &:hover {
      background-color: var(--info-500);
    }

    .avatar {
      height: 100%;
      aspect-ratio: 1/1;
      border-radius: 50%;
      pointer-events: none;
      margin-right: 10px;
      user-select: none;
    }

    .name {
      font-size: 1em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
      margin-right: 30px;
    }

    &.show-logout {
      &:hover {
        transform: translateX(-70px);
        // .logout {
        //   transform: translateX(0);
        // }
      }
    }

    .logout {
      display: block;
      position: absolute;
      font-size: 1.2em;
      background-color: var(--danger);
      height: 100%;
      aspect-ratio: 1/1;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      right: 0;
      transform: translateX(100%);
      transition: .3s;
    }
  }

  .menu {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    li {
      width: 100%;
      cursor: pointer;
      user-select: none;

      a {
        padding: 10px;
        width: 100%;
        height: 50px;
        display: block;
        line-height: 30px;
        user-select: none;
        font-size: 1.4em;
        text-align: center;
        font-weight: 800;
      }

      .router-link-active {
        color: #fff;
        background-color: var(--primary);
      }

      &:hover {
        background-color: var(--info);
      }
    }
  }
}
</style>
