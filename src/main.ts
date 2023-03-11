import { createApp } from "vue";
import App from "./App.vue";
// 清除默认样式
import "reset-css";
// 导入全局样式
import "@/styles/root.scss";
import router from "./router";
import pinia from '@/plugins/pinia'

console.log('欢迎使用melody!', 'v1.0.1');

const app = createApp(App);
// 注册pinia
app.use(pinia);
// 注册router
app.use(router);
app.mount("#app");
