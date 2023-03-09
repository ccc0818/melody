<script setup lang="ts">
import { IMusicDetail } from "@/store/music";
import AlbumImg from "@/assets/images/album-default.jpg";
import vLazyContainer from "@/direactives/vLazyContainer";

const props = defineProps<{
  playlist: Partial<IMusicDetail>[];
  show: boolean;
  playindex: number;
}>();

const emits = defineEmits<{
  (e: "onplay", i: number): void;
  (e: "ondel", i: number): void;
}>();

let lazyElRef = $ref<HTMLElement | null>(null);
onMounted(() => {
  watch(
    () => props.show,
    n => {
      if (!n) {
        return;
      }

      nextTick(() => {
        if (lazyElRef) {
          const imgs = lazyElRef.querySelectorAll("img");
          if (imgs.length <= 0) {
            return;
          }

          const sizeConatiner = lazyElRef.getBoundingClientRect();

          imgs.forEach((v: HTMLElement) => {
            const iSize = v.getBoundingClientRect();
            
            if (
              iSize.top > sizeConatiner.top &&
              iSize.top < sizeConatiner.top + sizeConatiner.height
            ) {
              v.setAttribute("src", v.dataset.src as string);
            }
          });
        }
      });
    }
  );
});
</script>

<template>
  <Transition name="playlist">
    <div class="playlist-container" v-show="show">
      <h1 class="title">播放列表</h1>
      <ul class="list" v-lazy-container="{ selector: 'img' }" ref="lazyElRef">
        <li
          v-for="(v, i) in playlist"
          :key="i"
          class="item"
          :class="i === playindex ? 'selected' : ''"
          @click.stop=""
          @dblclick.stop="emits('onplay', i)"
        >
          <img class="pic" :data-src="v.picUrl" :src="AlbumImg" />
          <div class="name">{{ v.musicName }}</div>
          <span
            class="iconfont icon-shanchu del"
            @click.stop="emits('ondel', i)"
          ></span>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.playlist-enter-from,
.playlist-leave-to {
  transform: translateX(100%);
}

.playlist-container {
  height: 100%;
  width: 300px;
  // overflow-y: auto;
  overflow: hidden;
  background-color: var(--background-a50);
  backdrop-filter: blur(20px);
  border-left: 1px solid var(--info-500);
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
  transition: 0.3s;

  .title {
    height: 80px;
    width: 100%;
    font-size: 2.4em;
    font-weight: 800;
    line-height: 80px;
    margin-left: 20px;
  }

  .list {
    height: calc(100% - 80px);
    width: 100%;
    overflow: auto;

    .item {
      font-size: 1.2em;
      padding: 8px 20px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      user-select: none;

      &:hover {
        background-color: var(--info-500);

        .del {
          transform: translateX(0);
        }
      }

      &.selected {
        background-color: var(--info);
        color: var(--primary);
      }

      .pic {
        height: 100%;
        aspect-ratio: 1/1;
        margin-right: 10px;
        pointer-events: none;
        border-radius: 8px;
      }

      .name {
        flex: 1;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 100%;
        line-height: 32px;
      }

      .del {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        aspect-ratio: 1/1;
        font-size: 1.4em;
        transition: 0.3s;
        background-color: var(--danger);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(100%);
        cursor: pointer;
      }
    }
  }
}
</style>
