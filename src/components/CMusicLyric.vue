<script setup lang="ts">
import AlbumImg from "@/assets/images/album-default.jpg";
import { debounce } from "@/utils";
import CAudioWave from "./CAudioWave.vue";

const props = withDefaults(
  defineProps<{
    show: boolean;
    picUrl: string;
    lyric: string;
    duration: number;
    currentTime: number;
    analyzer?: AnalyserNode;
    play: boolean;
  }>(),
  {
    show: false,
    picUrl: AlbumImg,
    lyric: "",
    duration: 0,
    currentTime: 0,
    play: false,
  }
);

const emits = defineEmits<{
  (e: "timeChange", t: number): void;
}>();

/**
 * 歌词模块
 * */
interface ILyric {
  words: string;
  time: number;
}

let lyricEl = $ref<HTMLElement | null>(null);
let ulEl = $ref<HTMLElement | null>(null);
let currentLyricIndexRef = $ref<number>(-1);
let autoScroll = true;
let ulHeight = 0;
let maxOffset = 0;

onMounted(() => {
  let timer = setInterval(() => {
    if (lyricEl && ulEl) {
      ulHeight = lyricEl.clientHeight;
      maxOffset = ulEl.clientHeight - ulHeight;
    }

    if (ulHeight > 0) {
      clearInterval(timer);
    }
  }, 100);
});

const lrcListRef = computed<ILyric[]>(() => {
  return parseLyric(props.lyric).filter(v => v.words);
});

/**
 * 解析歌词
 * @param lyric
 */
function parseLyric(lyric: string) {
  const parseTime = (timeStr: string) => {
    const [m, s] = timeStr.split(":");
    return +m * 60 + +s;
  };

  return lyric.split("\n").map<ILyric>(i => {
    let timeStrArr = i.match(/\[.+\]/);
    let timeStr = timeStrArr ? timeStrArr[0] : "[]";
    const time = parseTime(timeStr.slice(1, timeStr.length - 1));
    const words = i.slice(timeStr.length);
    return { time, words };
  });
}

/**
 * 获取当前时刻歌词的索引
 */
function getCurLyricIndex() {
  let i: number = -1;
  for (i = 0; i < lrcListRef.value.length; ++i) {
    if (lrcListRef.value[i].time > props.currentTime) {
      currentLyricIndexRef = i - 1;
      return i - 1;
    }
  }

  currentLyricIndexRef = i - 1;
  return i - 1;
}

/**
 * 歌词滚动
 */
watch(
  () => props.currentTime,
  () => {
    getCurLyricIndex();
    autoScroll && rollLyric();
  }
);

function rollLyric() {
  if (currentLyricIndexRef === -1) {
    lyricEl!.scrollTop = 0;
    return;
  }
  const curLiEl = ulEl!.children[currentLyricIndexRef] as HTMLElement;
  const liHeightHalf = curLiEl.clientHeight / 2;

  let offset = curLiEl.offsetTop + liHeightHalf - ulHeight / 2;

  if (offset < 0) offset = 0;
  if (offset > maxOffset) offset = maxOffset;

  lyricEl!.scrollTop = offset;
}

function lyricScrollIng() {
  autoScroll = false;
  debounce(() => {
    autoScroll = true;
  }, 2000);
}
</script>

<template>
  <Transition name="lyric">
    <div class="full-lyric" v-show="show">
      <img class="bg" :src="picUrl" />
      <div class="content">
        <div class="info">
          <div ref="lyricEl" class="lyric" @scroll="lyricScrollIng">
            <ul ref="ulEl">
              <li
                v-for="(v, i) in lrcListRef"
                :key="i"
                :class="currentLyricIndexRef === i ? 'active' : ''"
                @click="emits('timeChange', v.time)"
              >
                {{ v.words }}
              </li>
            </ul>
          </div>
        </div>
        <div class="img">
          <img class="album" :src="picUrl" />
        </div>
      </div>
      <!-- 音频可视化 -->
      <div class="melody">
        <CAudioWave :analyzer="analyzer" :chunks="64" :play="play" />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.full-lyric {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  transition: 0.3s;
  transform-origin: top;

  .bg {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
  }

  .content {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: var(--background-a50);
    backdrop-filter: blur(18px);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info {
      display: flex;
      height: 100%;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 30px;
      position: relative;

      .lyric {
        height: 60%;
        overflow-x: hidden;
        overflow-y: auto;
        scroll-behavior: smooth;
        position: relative;


        &::-webkit-scrollbar {
          width: 0;
        }

        ul {
          transition: 0.3s;
          overflow: hidden;
          position: relative;

          li {
            font-size: 1.2em;
            margin: 5px 0;
            padding: 5px 20px;
            line-height: 1.5em;
            transition: 0.3s;
            color: #ffffff77;

            &:hover {
              background-color: var(--info-a50);
              border-radius: 8px;
              cursor: pointer;
            }
          }

          li.active {
            color: #fff;
          }
        }
      }
    }

    .img {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 100px;

      .album {
        height: 60%;
        aspect-ratio: 1/1;
        pointer-events: none;
        border: 2px solid #fff;
        object-fit: cover;
        box-sizing: unset;
      }
    }
  }

  .melody {
    width: 600px;
    height: 60px;
    margin-top: 30px;
    position: absolute;
    left: 50%;
    bottom: 8px;
    transform: translateX(-50%);
  }
}

.lyric-enter-from,
.lyric-leave-to {
  transform: translateY(100%);
}
</style>
