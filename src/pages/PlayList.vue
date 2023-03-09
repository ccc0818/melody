<script setup lang="ts">
import { getPlaylistDetail, getPlaylistMusics } from "@/service";
import { IMusicDetail } from "@/store/music";
import { useRoute } from "vue-router";
import CMusicTable from "@/components/CMusicTable.vue";
import CSearch from "@/components/CSearch.vue";
import player from "@/utils/player";
import AlbumImg from "@/assets/images/album-default.jpg";
import UserImg from "@/assets/images/user-default.png";
import { debounce } from "@/utils";
import useStore from "@/store";

const route = useRoute();
const { musicStore } = useStore();
const { clearPlayList, addToPlayList } = musicStore;
const pid = Number(route.params.pid);

interface IAlbum {
  name: string;
  pic: string;
  createDate: string;
  count: number;
  playTimes: number;
  creator: {
    nickname: string;
    avatar: string;
  };
}

let album = $ref<IAlbum>({
  name: "",
  pic: AlbumImg,
  createDate: "",
  count: 0,
  playTimes: 0,
  creator: {
    nickname: "",
    avatar: UserImg,
  },
});
let songs: Partial<IMusicDetail>[] = [];
let filterRef = $ref<string>("");
let songsListRef = $ref(songs);

watch(
  () => filterRef,
  n => {
    debounce(() => {
      filter(n);
    }, 500);
  }
);

// 筛选歌曲
function filter(key: string) {
  songsListRef = songs.filter(v => {
    if (
      v.musicName?.includes(key) ||
      v.album?.includes(key) ||
      v.singers?.includes(key)
    ) {
      return true;
    }
    return false;
  });
}

// 加载歌单列表
onBeforeMount(async () => {
  // 获取歌单详情
  const detail = await getPlaylistDetail(pid);

  if (detail.code === 200) {
    // 设置歌单信息
    album.count = detail.playlist.trackCount;
    album.playTimes = detail.playlist.playCount;
    album.name = detail.playlist.name;
    album.pic = detail.playlist.coverImgUrl;
    album.createDate = new Date(
      detail.playlist.createTime
    ).toLocaleDateString();
    album.creator = {
      nickname: detail.playlist.creator.nickname,
      avatar: detail.playlist.creator.avatarUrl,
    };

    getPlaylistMusics(pid).then((res: any) => {
      if (res.code === 200) {
        songs = res.songs.map((v: any) => {
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

        songsListRef = songs;
      }
    });
  }
});

// 播放歌曲
function onPlayMusic(id: number) {
  player.play(id);
}

// 播放全部
function playAllHandle() {
  player.playAll(songs);
}
</script>

<template>
  <div class="playlist-container">
    <!-- 展示歌单信息 -->
    <div class="info">
      <img class="pic" :src="album.pic" />
      <div class="detail">
        <!-- 歌单名称 -->
        <h2 class="name">{{ album.name }}</h2>
        <!-- 创建者信息 -->
        <div class="creator">
          <img class="avatar" :src="album.creator.avatar" />
          <span class="nickname">{{ album.creator.nickname }}</span>
          <span class="createtime">{{ album.createDate }}创建</span>
        </div>
        <!-- 统计信息 -->
        <p class="statistic">
          歌曲数: {{ album.count }} &emsp; 播放数: {{ album.playTimes }}
        </p>
        <!-- 功能按钮 -->
        <div class="option">
          <button
            class="playall"
            :disabled="songsListRef.length ? false : true"
            @click="playAllHandle"
          >
            <span class="iconfont icon-24gf-play play" />播放全部
          </button>
          <CSearch
            class="search"
            v-model="filterRef"
            placeholder="搜索歌单歌曲"
          />
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="list">
      <CMusicTable
        :songs-list="songsListRef"
        @dbclick="onPlayMusic"
        :hasMore="false"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.playlist-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  .info {
    width: 100%;
    height: 200px;
    // background-color: red;
    position: relative;
    display: flex;
    border-bottom: 1px solid var(--info-500);
    padding: 20px;

    .pic {
      height: 100%;
      aspect-ratio: 1/1;
      pointer-events: none;
      border-radius: 8px;
    }

    .detail {
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      position: relative;
      flex: 1;

      .name {
        font-size: 2em;
        font-weight: 800;
      }

      .creator {
        display: flex;
        align-items: center;
        height: 35px;
        margin: 20px 0;

        .avatar {
          height: 100%;
          aspect-ratio: 1/1;
          border-radius: 50%;
          pointer-events: none;
        }

        .nickname {
          color: var(--primary);
          margin-left: 10px;
          margin-right: 10px;
        }
      }

      .option {
        position: absolute;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        height: 40px;

        .playall {
          background-color: var(--primary-120);
          color: #fff;
          font-size: 1.2em;
          border: none;
          border-radius: 8px;
          margin-right: 20px;
          padding: 5px 20px;
          display: flex;
          align-items: center;
          user-select: none;
          cursor: pointer;

          .play {
            font-size: 0.6em;
            border: 1px solid #fff;
            padding: 5px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }

        .search {
          height: 100%;
          width: 200px;
          border-radius: 20px;
        }
      }
    }
  }

  .list {
    height: calc(100% - 200px);
    overflow: hidden;
  }
}
</style>
