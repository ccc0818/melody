<script setup lang="ts">
import { PlayMode } from "@/store/player";
import CRange from "./CRange.vue";

const props = withDefaults(
  defineProps<{
    playmode: PlayMode;
    play: boolean;
    volume: number;
    muted: boolean;
    showPlayList: boolean
  }>(),
  {
    playmode: PlayMode.random,
    play: false,
    volume: 0.3,
    muted: false,
    showPlayList: false
  }
);

const emits = defineEmits<{
  (e: "modeChange"): void;
  (e: "play", state: boolean): void;
  (e: "volumeChange", volume: number): void;
  (e: "muteChange", state: boolean): void;
  (e: "onPre"): void;
  (e: "onNext"): void;
  (e: 'onplaylist'): void;
}>();

const modeIconRef = computed(() => {
  if (props.playmode === PlayMode.listCircle) {
    return "icon-xunhuan";
  }

  if (props.playmode === PlayMode.random) {
    return "icon-suijibofang";
  }

  if (props.playmode === PlayMode.singleCircle) {
    return "icon-danquxunhuan";
  }

  return "";
})

let volumeRef = $ref<number>(props.muted ? 0 : props.volume);

watch(
  () => props.volume,
  n => (volumeRef = n)
);

watch(() => props.muted, n => { 
  volumeRef = n ? 0 : props.volume
})
</script>

<template>
  <div class="controler">
    <span
      class="iconfont"
      :class="modeIconRef"
      @click="emits('modeChange')"
    ></span>
    <span class="iconfont icon-shangyishou" @click="emits('onPre')" />
    <span
      class="iconfont play"
      :class="!play ? 'icon-24gf-play' : 'icon-zanting'"
      @click="emits('play', !play)"
    />
    <span class="iconfont icon-xiayishou" @click="emits('onNext')" />
    <div class="volume">
      <span
        class="iconfont"
        :class="muted ? 'icon-quxiaoyinliang' : 'icon-yinlianggao'"
        @click="emits('muteChange', !muted)"
      />
      <CRange
        :min="0"
        :max="1"
        v-model="volumeRef"
        @drag="v => emits('volumeChange', v)"
        @change="v => emits('volumeChange', v)"
      />
    </div>
    <span class="iconfont icon-liebiao" :class="showPlayList ? 'open' : ''" @click.stop="emits('onplaylist')"></span>
  </div>
</template>

<style scoped lang="scss">
.controler {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;

  .iconfont {
    font-size: 1.4em;
    cursor: pointer;
    padding: 5px;
    border-radius: 8px;
    margin: 0 5px;
    text-align: center;

    &:hover {
      color: #fff;
      background-color: var(--primary);
    }

    &.play {
      font-size: 1.8em;
      padding: 10px;
      border-radius: 50%;
    }

    &.open {
      color: #fff;
      background-color: var(--primary);
    }
  }

  .volume {
    display: flex;
    align-items: center;
    width: 150px;

    &:hover {
      .slider {
        display: block;
      }
    }
  }
}
</style>
