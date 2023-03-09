<script setup lang="ts">
const props = defineProps<{
  name: string;
  pic: string;
  pid: number;
}>();

const emits = defineEmits<{
  (e: 'play', i: number): void;
  (e: 'show', i: number): void;
}>()
</script>

<template>
  <div class="album-card" @click="emits('show', pid)">
    <div class="img">
      <img class="pic" :src="pic" />
      <span class="iconfont icon-24gf-play play" @click.stop="emits('play', pid)"></span>
    </div>

    <div class="info">
      <p class="name">{{ name }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.album-card {
  position: relative;
  cursor: pointer;
  transition: 0.3s;

  .img {
    position: relative;
    aspect-ratio: 1/1;

    &:hover {
      .pic {
        box-shadow: 0 0 20px var(--info);
      }

      .play {
        display: block;
      }
    }

    .pic {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      aspect-ratio: 1/1;
      transition: 0.3s;
      pointer-events: none;
      border-radius: 12px;
    }

    .play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      padding: 10px;
      border-radius: 50%;
      border: 1px solid var(--primary);
      cursor: pointer;
      color: var(--primary);
      text-align: center;
      display: none;
    }
  }

  .info {
    width: 100%;
    margin-top: 10px;

    .name {
      font-size: 1.4em;
      font-weight: 600;
    }
  }
}
</style>
