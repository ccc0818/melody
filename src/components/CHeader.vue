<script setup lang="ts">
import Controler from "./CControler.vue";
import CSearch from "./CSearch.vue";
import CMusicBoard from "./CMusicBoard.vue";
import CMusicLyric from "./CMusicLyric.vue";
import Range from "./CRange.vue";
import useStore from "@/store";
import player from "@/utils/player";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { PlayMode } from "@/store/player";

const router = useRouter();
const { musicStore, playerStore } = useStore();
const { playerState } = storeToRefs(playerStore);

/**
 * 音乐信息面板
 */
const { musicDetail } = toRefs(musicStore.musicState);
const singerRef = computed(() => {
  return musicDetail.value.singers.join("&");
});

/**
 * Controler
 */
let likeRef = $ref<boolean>(false);
let durationRef = $ref<number>(
  player.audio.duration ? player.audio.duration : 0
);
let currentTimeRef = $ref<number>(player.audio.currentTime);
let play = $ref<boolean>(!player.audio.paused);
let playmode = $ref<PlayMode>(playerState.value.playmode);
let volume = $ref<number>(playerState.value.volume);
let muted = $ref<boolean>(playerState.value.muted);

watch(
  playerState,
  n => {
    play = n.play;
    playmode = n.playmode;
    volume = n.volume;
    muted = n.muted;
  },
  { deep: true }
);

// 注册播放器时间更新事件
player.audio.addEventListener("timeupdate", timeUpdateHandle);
function timeUpdateHandle() {
  durationRef = player.audio.duration;
  currentTimeRef = player.audio.currentTime;
}

/**
 * Search
 */
let searchTextRef = $ref<string>("");
function searchChangeHandle(v: string) {
  lyricShowRef = false;
  router.push({ name: "search", params: { s: v } });
}

/**
 * 歌词面板
 */
let lyricShowRef = $ref<boolean>(false);
</script>

<template>
  <div class="header-container">
    <!-- 展示区 显示歌词入口 -->
    <div class="music">
      <CMusicBoard
        @click="lyricShowRef = !lyricShowRef"
        :music-name="musicDetail.musicName"
        :singer="singerRef"
        :pic="musicDetail.picUrl"
        :duration="durationRef"
        :current-time="currentTimeRef"
        :play="play"
        :like="likeRef"
        @like-change="s => (likeRef = s)"
      />
    </div>

    <!-- 控制器 -->
    <div class="controler">
      <Controler
        :play="play"
        :playmode="playmode"
        :volume="volume"
        :muted="muted"
        @mode-change="() => playerStore.switchPlayMode()"
        @mute-change="s => (player.muted = s)"
        @play="s => (s ? player.play() : player.pause())"
        @volume-change="v => (player.volume = v)"
      />
    </div>

    <!-- 搜索框 -->
    <div class="search">
      <CSearch v-model="searchTextRef" @change="searchChangeHandle" />
    </div>

    <!-- 进度条 -->
    <Range
      class="progress"
      :min="0"
      :max="durationRef"
      v-model="currentTimeRef"
      @change="v => (player.audio.currentTime = v)"
    />

    <!-- 歌词面板 -->
    <Teleport to="body">
      <CMusicLyric
        :show="lyricShowRef"
        :pic-url="musicDetail.picUrl ? musicDetail.picUrl : undefined"
        :lyric="musicDetail.lyric"
        :duration="durationRef"
        :current-time="currentTimeRef"
        :analyzer="player.analyzer"
        :play="play"
        @time-change="t => (player.audio.currentTime = t)"
      />
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.header-container {
  width: 100%;
  height: 100%;
  padding: 0 50px;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 100%;
  grid-template-areas: "music . controler . search";
  justify-content: center;
  // overflow: hidden;
  // font-size: 1em;
  backdrop-filter: blur(20px);
  z-index: 99;

  .controler {
    grid-area: controler;
    // width: 400px;
    height: 100%;
  }

  .music {
    grid-area: music;
    // width: 400px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .search {
    grid-area: search;
    // width: 400px;
    height: 100%;
  }

  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(50%);
    z-index: 99;
  }
}
</style>
