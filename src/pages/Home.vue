<script setup lang="ts">
import CRecommendCard from "@/components/CRecommendCard.vue";
import { getRankPlaylist, getRecommendPlaylist } from "@/service";
import { useRouter } from "vue-router";

const router = useRouter();

interface IPlayList {
  name: string;
  pic: string;
  pid: number;
}

let recommendListRef = $ref<IPlayList[]>([]);
let rankListRef = $ref<IPlayList[]>([]);

onBeforeMount(async () => {
  // 获取推荐歌单
  const res = await getRecommendPlaylist();
  if (res.code === 200) {
    recommendListRef = res.result.map((v: any) => ({
      name: v.name,
      pic: v.picUrl,
      pid: v.id,
    }));
  }

  // 获取排行榜单
  const resRank = await getRankPlaylist();
  if (resRank.code === 200) {
    rankListRef = resRank.list.map((v: any) => ({
      name: v.name,
      pic: v.coverImgUrl,
      pid: v.id,
    }));
  }
});
</script>

<template>
  <KeepAlive>
    <div class="home-container">
      <!-- 推荐歌单 -->
      <CRecommendCard
        :list="recommendListRef"
        title="推荐歌单"
        :more="true"
        @more="router.push({ name: 'playcategory' })"
      />

      <!-- 排行榜 -->
      <CRecommendCard :list="rankListRef" title="排行榜" :more="false" />
    </div>
  </KeepAlive>
</template>

<style scoped lang="scss">
.home-container {
  width: 100%;
  padding: 20px;
}
</style>
