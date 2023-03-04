import { PlayMode } from "@/store/player";
import useStore from "@/store";
import player from "./player";

const cacheSymbol = Symbol.for('cache').toString()

interface ICache {
  volume: number;
  muted: boolean;
  playmode: PlayMode;
}

export function saveCache() { 
  const { playerStore } = useStore()
  const { playerState } = playerStore

  const cache: ICache = {
    volume: playerState.volume,
    playmode: playerState.playmode,
    muted: playerState.muted
  }

  localStorage.setItem(cacheSymbol, JSON.stringify(cache));
}

function isCache(obj: object): obj is ICache {
    return !!(obj as ICache).volume
}

export function restoreCache() { 
  const { playerStore } = useStore();
  const { setPlayerState } = playerStore;

  const json = localStorage.getItem(cacheSymbol);
  if (!json) { 
    return;
  }
  const cache = JSON.parse(json);
  if (isCache(cache)) {
    player.volume = cache.volume
    player.muted = cache.muted
    setPlayerState({
      playmode: cache.playmode
    })
  } else { 
    localStorage.removeItem(cacheSymbol);
  }

}