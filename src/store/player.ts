import { defineStore } from "pinia";
import player from "@/utils/player";
import useMusicStore from "./music";

export enum PlayMode {
  singleCircle = 0,
  listCircle,
  random,
}

interface IPlayerState {
  volume: number;
  play: boolean;
  muted: boolean;
  playmode: PlayMode;
}

/**
 * 播放器状态管理库
 */
const usePlayerStore = defineStore("player", () => {
  const playerState = ref<IPlayerState>({
    volume: 0,
    play: false,
    muted: false,
    playmode: PlayMode.singleCircle,
  });

  function initPlayerStore() {
    // 初始化属性
    setPlayerState({
      volume: player.audio.volume,
      muted: player.audio.muted,
      play: !player.audio.paused,
    });

    // 注册空格按键
    document.addEventListener('keyup', (e: KeyboardEvent) => { 
      if (e.key === " ") { 
        // 按下了空格键
        if (playerState.value.play) {
          player.pause();
        } else {
          player.play();
        } 
      }
    })

    // 注册播放事件
    player.audio.addEventListener("playing", () => {
      setPlayerState({
        play: true,
      });
      // 初始化解析器
      player.initAudioCtx();
    });

    // 注册暂停时间
    player.audio.addEventListener("pause", () => {
      setPlayerState({
        play: false,
      });
    });

    // 注册音量变化事件
    player.audio.addEventListener("volumechange", () => {
      setPlayerState({
        volume: player.audio.volume,
      });
    });

    // 注册播放结束事件
    player.audio.addEventListener("ended", () => {
      // 歌曲结束时跟据播放模式状态判断如何播放
      if (playerState.value.playmode === PlayMode.singleCircle) {
        player.play();
      } else {
        const musicStore = useMusicStore();
        const { switchMusic } = musicStore;
        switchMusic().then(res => {
          player.audio.src = res.url;
          player.play();
        });
      }
    });
  }

  /**
   * 设置播放器状态
   * @param state
   */
  function setPlayerState(state: Partial<IPlayerState>) {
    playerState.value = {
      ...playerState.value,
      ...state,
    };
  }

  /**
   * 切换播放模式
   */
  function switchPlayMode() {
    if (playerState.value.playmode === PlayMode.random) {
      playerState.value.playmode = PlayMode.singleCircle;
    } else {
      playerState.value.playmode++;
    }
  }

  return {
    playerState,
    setPlayerState,
    switchPlayMode,
    initPlayerStore,
  };
});

export default usePlayerStore;
