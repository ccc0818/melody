import axios from "@/plugins/axios";

export function isLogin() { 
  return localStorage.getItem('login');
}

export function markLogin() {
  return localStorage.setItem("login", '1');
}

export function delLoginMark() { 
  return localStorage.removeItem('login');
}

/**
 * 获取应用的Key
 */
export function getKey() {
  return axios.get(`/login/qr/key?timestamp=${Date.now()}`) as any;
}

/**
 * 获取登录二维码
 * @param key
 * @returns
 */
export function getQrCode(key: string) {
  return axios.get(
    `/login/qr/create?key=${key}&timestamp=${Date.now()}`
  ) as any;
}

/**
 * 检查二维码的状态
 * @param key
 * @returns
 */
export function getQrState(key: string) {
  return axios.get(`/login/qr/check?key=${key}&timestamp=${Date.now()}`) as any;
}

/**
 * 以游客身份登录
 * @returns
 */
export function loginAsGuest() {
  return axios.get("/register/anonimous") as any;
}

/**
 * 获取登录状态
 * @returns
 */
export function getLoginState(cookie?: string) {
  return axios.post(`/login/status?timeStamp=${Date.now()}`, {
    cookie,
  }) as any; 
}

/**
 * 获取账户信息
 * 在用户登录后可以调用
 */
export function getAccountInfo() {
  return axios.get("/user/account");
}

/**
 * 获取用户详情
 * @param uid
 * @returns
 */
export function getUserInfo(uid: number) {
  return axios.get(`/user/detail?uid=${uid}`);
}

/**
 * 注销
 * @returns 
 */
export function loginOut() { 
  return axios.get('/logout')
}