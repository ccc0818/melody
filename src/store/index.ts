import useMusicStore from "./music"
import usePlayerStore from "./player";
import useUserStore from "./user";

export default function useStore() {
  return {
    musicStore: useMusicStore(),
    playerStore: usePlayerStore(),
    userStore: useUserStore()
  };
}