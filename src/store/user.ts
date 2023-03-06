import { defineStore } from 'pinia'

export interface IUserInfo { 
  avatar: string;
  nickname: string;
}

export interface IUserState { 
  login: boolean;
  uid: number;
  detail: IUserInfo
}

const useUserStore = defineStore('user', () => { 
  const userState = ref<IUserState>({
    login: false,
    uid: 0,
    detail: {
      avatar: '',
      nickname: ''
    }
  });

  function setUserState(obj: Partial<IUserState>) { 
    userState.value = {
      ...userState.value,
      ...obj
    };
  }

  function setUserDetail(obj: Partial<IUserInfo>) { 
    userState.value.detail = {
      ...userState.value.detail,
      ...obj
    };
  }

  return {
    userState,
    setUserState,
    setUserDetail,
  };
})

export default useUserStore;