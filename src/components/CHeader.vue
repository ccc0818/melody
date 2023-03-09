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
import CPlayList from "./CPlayList.vue";

const router = useRouter();
const { musicStore, playerStore } = useStore();
const { playerState } = storeToRefs(playerStore);

/**
 * 音乐信息面板
 */
const { musicDetail, playList, index } = toRefs(musicStore.musicState);
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

/**
 * 播放列表
 */
let playlistShowRef = $ref<boolean>(false);
document.addEventListener("click", () => {
  if (playlistShowRef) {
    playlistShowRef = false;
  }
});

// 从播放列表删除
const { delFromPlayList } = musicStore;
function ondelHandle(i: number) {
  delFromPlayList(i);
}

// 播放
function onplayHandle(i: number) {
  player.play(playList.value[i].id, i);
}
</script>

<template>
  <div class="header-container" @click="lyricShowRef = !lyricShowRef">
    <!-- 展示区 显示歌词入口 -->
    <div class="music">
      <CMusicBoard
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
    <div class="controler" @click.stop="">
      <Controler
        :play="play"
        :playmode="playmode"
        :volume="volume"
        :muted="muted"
        :show-play-list="playlistShowRef"
        @mode-change="() => playerStore.switchPlayMode()"
        @mute-change="s => (player.muted = s)"
        @play="s => (s ? player.play() : player.pause())"
        @volume-change="v => (player.volume = v)"
        @on-next="player.switchPlay()"
        @on-pre="player.switchPlay(false)"
        @onplaylist="playlistShowRef = !playlistShowRef"
      />
    </div>

    <!-- 搜索框 -->
    <div class="search" @click.stop="">
      <CSearch
        style="height: 100%"
        v-model="searchTextRef"
        @change="searchChangeHandle"
        placeholder=""
      />
    </div>

    <!-- 播放列表 -->
    <Teleport to="body">
      <CPlayList
        :show="playlistShowRef"
        :playlist="playList"
        :playindex="index"
        @ondel="ondelHandle"
        @onplay="onplayHandle"
      />
    </Teleport>

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
  align-items: center;
  justify-items: center;
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
    height: 70%;
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
