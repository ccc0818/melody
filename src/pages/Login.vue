<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import {
  CodeState,
  getKey,
  getLoginState,
  getQrCode,
  getQrState,
  markLogin,
} from "@/service";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import useStore from "@/store";

const { userStore } = useStore();
const { setUserDetail, setUserState } = userStore;
const route = useRoute();
const router = useRouter();
let key: string;
let qrUrlRef = $ref<string>("");
let codeStateRef = $ref<CodeState>(CodeState.wait);

onBeforeMount(async () => {
  // 初始化二维码
  const resKey = await getKey();
  key = resKey.data.unikey;

  if (resKey.data.code === 200) {
    const resCode = await getQrCode(key);
    qrUrlRef = resCode.data.qrurl;
    loopCheck(key);
  }
});

// 轮训检查二维码状态
let timer: number = 0;
function loopCheck(key: string) {
  clearInterval(timer);
  timer = setInterval(async () => {
    const res = await getQrState(key);
    if (res.code === CodeState.expire) {
      // 过期
      codeStateRef = CodeState.expire;
      clearInterval(timer);
    } else if (res.code === CodeState.waitack) {
      // 等待授权
      codeStateRef = CodeState.waitack;
    } else if (res.code === CodeState.access) {
      // 登录成功
      clearInterval(timer);
      codeStateRef = CodeState.access;

      // 获取登录状态
      const login = await getLoginState();
      if (login.data.code === 200 && login.data.profile) {
        // 已登录
        markLogin(); // 标记已经登录

        setUserState({
          login: true,
          uid: login.data.profile.userId,
        });

        setUserDetail({
          avatar: login.data.profile.avatarUrl,
          nickname: login.data.profile.nickname,
        });

        router.back();
      }
    }
  }, 2000);
}

onBeforeRouteLeave(() => {
  // 离开时清除轮询
  clearInterval(timer);
});

// 刷新二维码
async function refreshCodeHandle() {
  if (codeStateRef !== CodeState.expire) return;

  const resCode = await getQrCode(key);
  qrUrlRef = resCode.data.qrurl;
  codeStateRef = CodeState.wait;
  loopCheck(key);
}
</script>

<template>
  <div class="login-container" v-if="qrUrlRef">
    <div class="qr-container">
      <h1 class="title">请使用网易云音乐APP扫码授权登录</h1>

      <!-- 二维码登录 -->
      <div class="qr-code">
        <QrcodeVue
          :value="qrUrlRef"
          :size="256"
          :margin="2"
          foreground="#8a2be2"
          background="#8a2be277"
          level="L"
          class="qr-vue"
        />
        <div
          class="mask"
          @click="refreshCodeHandle"
          v-show="codeStateRef !== CodeState.wait"
        >
          <span
            class="iconfont icon-shuaxin"
            v-if="codeStateRef === CodeState.expire"
            >&ensp;二维码已过期, 点击刷新</span
          >
          <span
            class="iconfont icon-chenggong"
            v-else-if="codeStateRef === CodeState.waitack"
            >&ensp;已扫描, 等待授权</span
          >
          <span
            class="iconfont icon-chenggong"
            v-else-if="codeStateRef === CodeState.access"
            >&ensp;授权登录成功</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  position: relative;

  .qr-container {
    width: 256px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title {
      margin: 15px 0;
      font-size: 1.3em;
      text-align: center;
    }

    .qr-code {
      aspect-ratio: 1/1;
      border-radius: 8px;
      background-color: var(--info-500);
      overflow: hidden;
      position: relative;

      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #2c2c2cc3;
        backdrop-filter: blur(20px);
        left: 0;
        top: 0;
        color: #fff;
        text-align: center;
        line-height: 256px;
        user-select: none;
        cursor: pointer;
      }
    }
  }
}

.qr-vue {
  color: var(--primary);
  background-color: #fff;
  width: 100%;
}
</style>
