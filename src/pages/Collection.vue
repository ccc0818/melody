<script setup lang="ts">
import { getUserPlaylist, getPlaylistMusics } from "@/service";
import useStore from "@/store";
import { storeToRefs } from "pinia";
import CAlbumCard from "@/components/CAlbumCard.vue";
import { useRouter } from "vue-router";
import player from "@/utils/player";

const { userStore } = useStore();
const { userState } = storeToRefs(userStore);
const router = useRouter();

interface IPlayList {
  pid: number;
  name: string;
  pic: string;
}

onBeforeMount(async () => {
  loadPlayList();
});

// 加载歌单列表
let playListRef = $ref<IPlayList[]>([]);
let offset = 0;
async function loadPlayList(more: boolean = false) {
  const res = await getUserPlaylist(userState.value.uid, offset);
  // console.log(res);
  if (res.code === 200) {
    const tmpArr: IPlayList[] = res.playlist.map((v: any) => ({
      name: v.name,
      pic: v.coverImgUrl,
      pid: v.id,
    }));

    if (more) {
      playListRef.push(...tmpArr);
    } else {
      playListRef = tmpArr;
    }

    offset += tmpArr.length;

    if (res.more) {
      loadPlayList(true);
    }
  }
}

// 显示歌单列表
function onShowHandle(pid: number) {
  router.push({ name: "playlist", params: { pid } });
}

// 播放歌单
function onPlayHandle(pid: number) {
  getPlaylistMusics(pid).then((res: any) => {
    if (res.code === 200) {
      const songs = res.songs.map((v: any) => {
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

      player.playAll(songs);
    }
  });
}
</script>

<template>
  <div class="collect-container">
    <CAlbumCard
      class="card"
      v-for="(v, i) in playListRef"
      :key="i"
      :name="v.name"
      :pic="v.pic"
      :pid="v.pid"
      @play="onPlayHandle"
      @show="onShowHandle"
    />
  </div>
</template>

<style scoped lang="scss">
.collect-container {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 20px;
  justify-content: space-around;
  justify-items: center;
  align-items: center;

  .card {
    width: 100%;
  }
}
</style>
