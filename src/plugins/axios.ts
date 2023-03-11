import { showMessage } from "@/utils";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    if (
      (response.data.code && response.data.code !== 200) ||
      (response.data.data?.code && response.data.data?.code !== 200)
    ) {
      showMessage({ type: "danger", message: "请求结果异常" });
    }

    return response.data as any;
  },
  function (error) {
    showMessage({ type: "danger", message: "请求异常" });
    return Promise.reject(error);
  }
);

export default instance;
