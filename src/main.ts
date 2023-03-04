import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
// 清除默认样式
import "reset-css";
// 导入全局样式
import "@/styles/root.scss";
import router from "./router";

const pinia = createPinia();
createApp(App)
  .use(pinia).use(router).mount("#app");
