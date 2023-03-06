<script setup lang="ts">
import AlbumImg from "@/assets/images/album-default.jpg";

const props = withDefaults(
  defineProps<{
    musicName: string;
    singer: string;
    pic: string;
    duration: number;
    currentTime: number;
    play: boolean;
    like: boolean;
  }>(),
  {
    musicName: "",
    singer: "",
    pic: AlbumImg,
    duration: 0,
    currentTime: 0,
    play: false,
    like: false,
  }
);

const emits = defineEmits<{
  (e: "likeChange", state: boolean): void;
}>();

const timeRef = computed(() => {
  function s2m(s: number) {
    return `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  }

  return `${s2m(props.currentTime)}/${s2m(props.duration)}`;
});

onMounted(() => {
  alumRotate(props.play);
  songNameRoll();
});

watch(
  () => props.play,
  n => {
    alumRotate(n);
    songNameRoll();
  }
);

let currentRotateDeg = 0;
let timer: number = 0;
function alumRotate(play: boolean) {
  clearInterval(timer);
  if (play) {
    timer = setInterval(() => {
      currentRotateDeg++;
      if (albumEl) {
        albumEl.style.transform = `rotate(${currentRotateDeg}deg)`;
      }
    }, 40);
  } else {
    clearInterval(timer);
  }
}

const albumEl = $ref<HTMLElement | null>(null);
const songNameEl = $ref<HTMLElement | null>(null);
let timerRoll: number = 0;
function songNameRoll() {
  clearInterval(timerRoll);
  if (!songNameEl) {
    songNameRoll();
    return;
  }

  let left = 0;
  let step = 1;

  if (songNameEl.scrollWidth > songNameEl.clientWidth) {
    // 滚动
    timerRoll = setInterval(() => {
      left += step;

      if (left > songNameEl.scrollWidth - songNameEl.clientWidth) {
        step = -step;
      } else if (left < 0) {
        left = 0;
        step = -step;
      }
      songNameEl.scrollTo({ left });
    }, 100);
  } else {
    clearInterval(timerRoll);
  }
}
</script>

<template>
  <div class="music-board">
    <!-- 音乐图片 -->
    <div ref="albumEl" class="img">
      <img class="album" :src="pic ? pic : AlbumImg" />
    </div>

    <!-- 歌曲信息 -->
    <div class="song" :class="!duration ? 'hide' : ''">
      <!-- 歌名 歌手 -->
      <p ref="songNameEl" class="name">{{ musicName }} {{ singer }}</p>
      <!-- 时间 -->
      <p class="time">
        {{ timeRef }}
      </p>
      <span
        class="iconfont icon-like"
        :class="like ? 'icon-xihuan like' : 'icon-xihuan1'"
        @click.stop="emits('likeChange', !like)"
      ></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.music-board {
  width: clamp(200px, 100%, 400px);
  height: 70%;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  cursor: pointer;

  .img {
    height: 120%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #111;
    z-index: 99;
    flex: 0 0 auto;
  }

  .album {
    height: 100%;
    transform: scale(1.2);
    pointer-events: none;
    border-radius: 50%;
    border: 13px solid #000;
  }

  .song {
    padding: 5px;
    height: 100%;
    display: flex;
    width: 300px;
    flex-direction: column;
    background-color: var(--info-a50);
    border-radius: 8px;
    transition: 0.8s;
    transform-origin: left;
    padding-left: 30px;
    padding-right: 20px;
    margin-left: -20px;
    position: relative;
    overflow: hidden;

    &.hide {
      width: 0;
      padding: 0;
    }

    .name {
      line-height: 25px;
      font-size: 1em;
      white-space: nowrap;
      overflow-x: auto;
      height: 25px;
      padding-right: 20px;
      width: 100%;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .time {
      line-height: 15px;
      font-size: 0.8em;
    }
  }

  .icon-like {
    font-size: 1.2em;
    position: absolute;
    right: 20px;
    bottom: 5px;
    user-select: none;
    cursor: pointer;
    transition: 0.1s;

    &:hover {
      transform: scale(1.2);
    }
  }

  .like {
    color: var(--primary);
  }
}
</style>
