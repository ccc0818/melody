<script setup lang="ts">
import { useRoute } from "vue-router";
import { searchSong } from "@/service";
import CMusicTable from "@/components/CMusicTable.vue";
import { showMessage } from "@/utils";
import useStore from "@/store";
import player from "@/utils/player";
import { IMusicDetail } from "@/store/music";

const route = useRoute();
const { musicStore } = useStore();
const { search, addToPlayList } = musicStore;
let offsetRef = $ref<number>(0);
let songCount = $ref<number>(0);
let songsListRef = $ref<any[]>([]);
const hasMoreRef = computed<boolean>(() => {
  return songsListRef.length < songCount;
});

const musicListRef = computed<Partial<IMusicDetail>[]>(() => {
  return songsListRef.map(v => {
    return {
      id: v.id,
      musicName: v.name,
      fee: v.fee,
      picUrl: v.al.picUrl,
      singers: v.ar.map((v: any) => v.name),
      album: v.al.name,
      pushTime: v.publishTime,
    };
  });
});

onBeforeMount(() => {
  searchHandle();
});

watch(
  () => route.params.s,
  () => {
    offsetRef = 0;
    searchHandle();
  }
);

/**
 * 搜索歌曲
 * @param more
 */
async function searchHandle(more: boolean = false) {
  try {
    const res = await search(route.params.s as string, offsetRef);
    songCount = res.songCount;

    if (songCount === 0) { 
      return
    }

    if (more) {
      songsListRef.push(...res.songs);
    } else {
      songsListRef = res.songs;
    }

    offsetRef = songsListRef.length;
  } catch (err) {
    showMessage({
      type: "danger",
      message: "加载请求失败",
    });
  }
}

/**
 * 播放选中的音乐
 * @param song
 */
function playHandle(id: number) {
  player.play(id);
}

function loadMoreHandle() {
  searchHandle(true);
}

function addToPlaylistHandle(music: Partial<IMusicDetail>) { 
  addToPlayList([music])
}

</script>

<template>
  <div>
    <CMusicTable
      :songsList="musicListRef"
      :hasMore="hasMoreRef"
      @play="playHandle"
      @add="addToPlaylistHandle"
      @more="loadMoreHandle"
    />
  </div>
</template>

<style scoped lang="scss"></style>
