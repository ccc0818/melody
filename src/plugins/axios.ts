import { showMessage } from "@/utils";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.response.use(
  function (response) {
    if (response.status !== 200 || response.data.code !== 200) { 
      showMessage({
        type: "warning",
        message: "响应状态为" + response.status + ' ' + response.data.code,
      });
    }
    
    return response.data as any;
  },
  function (error) {
    showMessage({
      type: "danger",
      message: "请求失败!",
    });
    
    return Promise.reject(error);
  }
);

export default instance;
