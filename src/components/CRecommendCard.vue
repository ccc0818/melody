<script setup lang="ts">
import { useRouter } from "vue-router";
import CAlbumCard from "./CAlbumCard.vue";
import player from "@/utils/player";

const router = useRouter();
const props = defineProps<{
  list: any[];
  title: string;
  more: boolean;
}>();

const emits = defineEmits<{
  (e: "more"): void;
}>();

function showHandle(pid: number) {
  router.push({ name: "playlist", params: { pid } });
}

function playHandle(pid: number) {
  player.playAll(pid);
}
</script>

<template>
  <div class="recommend-container">
    <span class="title" :class="more ? 'more' : ''" @click="emits('more')">{{ title }}</span>
    <div class="list">
      <CAlbumCard
        class="card"
        v-for="(v, i) in list"
        :key="i"
        :name="v.name"
        :pic="v.pic"
        :pid="v.pid"
        @show="showHandle"
        @play="playHandle"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.recommend-container {
  width: 100%;
  margin-bottom: 80px;

  .title {
    display: block;
    font-size: 3em;
    font-weight: 800;
    user-select: none;
    width: fit-content;
    margin: 20px 0;

    &.more {
      &:hover {
        cursor: pointer;
        text-decoration: underline;
        color: #fff;
      }
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    justify-items: center;
    justify-content: space-between;
    grid-gap: 30px;

    .card {
      width: 100%;
    }
  }
}
</style>
