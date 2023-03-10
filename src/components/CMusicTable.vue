<script lang="ts" setup>
import { IMusicDetail } from '@/store/music';
import { debounce } from '@/utils'
import AlbumImg from '@/assets/images/album-default.jpg';
import vLazyContainer from '@/direactives/vLazyContainer'

const props = withDefaults(defineProps<{
  songsList: Partial<IMusicDetail>[]
  hasMore: boolean
}>(), {
  hasMore: false
})

const emits = defineEmits<{
  (e: 'more'): void
  (e: 'play', id: number): void
  (e: 'add', music: Partial<IMusicDetail>): void
}>()

function loadMoreHandle() {
  debounce(() => {
    emits('more')
  })
}
</script>

<template>
  <div class="music-table" v-lazy-container="{selector: 'img'}">
    <ul class="ul">
      <!-- 左侧 -->
      <li class="item" v-for="v in songsList" :key="v.id" @dblclick="emits('play', v.id as number)">
        <div class="left">
          <img class="al" :data-src="v.picUrl" :src="AlbumImg">
          <div class="info">
            <p class="name">{{ v.musicName }}</p>
            <p class="singer">{{ v.singers!.join('&') }}</p>
          </div>
        </div>
        <!-- mid -->
        <div class="mid">
          <p class="al-name">{{ v.album }}</p>
          <p class="date">发布日期: {{ (new Date(v.pushTime as number).toLocaleDateString()) }}</p>
        </div>

        <!-- option -->
        <div class="option">
          <span class="iconfont icon-24gf-play play" @click="emits('play', v.id as number)"></span>
          <span class="iconfont icon-jia add" @click="emits('add', v)"></span>
        </div>
      </li>
    </ul>
    <div class="load-more" v-if="hasMore" @click="loadMoreHandle">加载更多</div>
  </div>
</template>

<style scoped lang="scss">
.music-table {
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  overflow: auto;
  position: relative;

  .item {
    width: 100%;
    // height: 80px;
    padding: 10px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    // grid-template-rows: 60px;
    cursor: pointer;
    user-select: none;
    position: relative;
    overflow: hidden;

    &:hover {
      background-color: var(--info);
      border-radius: 8px;
      .option {
        transform: translateX(0);
      }
    }

    .left {
      display: flex;
      align-items: center;
      height: 100%;

      .al {
        height: 60px;
        aspect-ratio: 1/1;
        border-radius: 8px;
        pointer-events: none;
      }

      .info {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          font-size: 1.1em;
        }

        .singer {
          font-size: 0.8em;
          margin-top: 5px;
        }
      }
    }

    .mid {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .date {
        font-size: .8em;
        margin-top: 5px;
      }
    }

    .option {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      right: 0;
      height: 100%;
      transform: translateX(100%);
      transition: .3s;
      
      .play, .add {
        height: 100%;
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6em;
        user-select: none;
        cursor: pointer;
      }

      .play {
        background-color: var(--primary);
      }
      .add {
        background-color: #3686ff;
      }

    }
  }

  .load-more {
    padding: 15px 30px;
    background-color: var(--info-a50);
    width: fit-content;
    border-radius: 8px;
    margin: 10px auto;
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: var(--primary);
    }
  }
}
</style>