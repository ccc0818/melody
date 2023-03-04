import useMusicStore from "./music"
import usePlayerStore from "./player";

export default function useStore() {
  return {
    musicStore: useMusicStore(),
    playerStore: usePlayerStore(),
  };
}