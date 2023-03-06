import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

instance.interceptors.response.use(
  function (response) {
    return response.data as any;
  },
  function (error) { 
    return Promise.reject(error);
  }
);

export default instance;
