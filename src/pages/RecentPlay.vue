<script setup lang="ts">
import { getRecentPlaylist } from "@/service";
import { IMusicDetail } from "@/store/music";
import CMusicTable from "@/components/CMusicTable.vue";
import player from "@/utils/player";
import useStore from "@/store";

const { musicStore } = useStore()
const { addToPlayList } = musicStore
let musicListRef = $ref<Partial<IMusicDetail>[]>([]);

onBeforeMount(async () => {
  const res = await getRecentPlaylist();
  if (res.code === 200) {
    musicListRef = res.data.list.map((item: any) => {
      const v = item.data;
      return {
        id: v.id,
        musicName: v.name,
        singers: v.ar.map((v: any) => v.name),
        picUrl: v.al.picUrl,
        fee: v.fee,
        album: v.al.name,
        pushTime: v.publishTime,
      };
    });
  }
});

</script>

<template>
  <div class="recent-container">
    <CMusicTable :songs-list="musicListRef" :has-more="false" @play="player.play" @add="(music) => addToPlayList([music])"/>
  </div>
</template>

<style scoped lang="scss"></style>
