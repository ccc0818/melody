<script setup lang="ts">
import UserImg from "@/assets/images/user-default.png";

const props = withDefaults(defineProps<{
  routerList: Array<{ name: string; to: object } | undefined>;
  user: { avatar: string; nickname: string }
  login: boolean
}>(), {
  routerList: () => ([]),
  user: () => ({
    avatar: UserImg,
    nickname: '未登录',
    login: true
  })
})

const emits = defineEmits<{
  (e: 'login'): void
  (e: 'logout'): void
}>()
</script>

<template>
  <div class="aside-container">
    <!-- 用户 -->
    <div class="user" @click="emits('login')">
      <img class="avatar" :src="user.avatar ? user.avatar : UserImg" />
      <p class="name">{{ user.nickname ? user.nickname : "未登录" }}</p>
      <span class="iconfont icon-a-icon_tuichudengchu" v-if="login" @click.stop="emits('logout')"></span>
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

  .user {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    margin: 20px 0;
    cursor: pointer;
    position: relative;

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
      font-size: 0.8em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
      margin-right: 30px;
    }

    .iconfont {
      font-size: 1em;
      padding: 5px;
      border-radius: 8px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      
      &:hover {
        background-color: var(--info-a50);
        color: var(--primary);
      }
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
        display: block;
        user-select: none;
      }

      .router-link-active {
        color: var(--primary);
        background-color: var(--info-500);
      }

      &:hover {
        background-color: var(--info);
      }
    }
  }
}
</style>
