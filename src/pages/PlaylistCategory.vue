<script setup lang="ts">
import { getPlaylistByType, getPlaylistCategory } from "@/service";
import CAlbumCard from "@/components/CAlbumCard.vue";
import CPager from "@/components/CPager.vue";
import player from "@/utils/player";
import { useRouter } from "vue-router";

interface ICategory {
  category: string;
  styles: string[];
}

interface IPlayList {
  name: string;
  pic: string;
  pid: number;
}

const router = useRouter();
let categorysRef = $ref<ICategory[]>([]);
let curCategoryRef = $ref<string>("全部歌单");
let showCategoryPanelRef = $ref<boolean>(false);
let playlistListRef = $ref<IPlayList[]>([]);
let totalRef = $ref<number>(0);
const limit = 15;
let pageRef = $ref<number>(1);

onBeforeMount(async () => {
  const res = await getPlaylistCategory();
  if (res.code === 200) {
    // 初始化种类
    Object.values<string>(res.categories).forEach((v: string) => {
      categorysRef.push({
        category: v,
        styles: [],
      });
    });

    // 初始化风格
    res.sub.forEach((v: any, i: number) => {
      categorysRef[v.category].styles.push(v.name);
    });

    updatePlaylist(undefined, 0, limit);
  }
});

// 播放歌曲
function showHandle(pid: number) {
  router.push({ name: "playlist", params: { pid } });
}

// 播放全部
function playAllHandle(pid: number) {
  player.playAll(pid);
}

// 更新当前选择的分类
function selectCategoryHandle(key: string) {
  showCategoryPanelRef = false;

  if (curCategoryRef === key) {
    curCategoryRef = "全部歌单";
    updatePlaylist();
  } else {
    curCategoryRef = key;
    updatePlaylist(key);
  }
}

// 更新歌单列表
async function updatePlaylist(cat?: string, offset: number = 0, limit: number = 30) {
  const res = await getPlaylistByType(cat, offset, limit);

  if (res.code === 200) {
    totalRef = res.total;

    playlistListRef = res.playlists.map((v: any) => ({
      name: v.name,
      pic: v.coverImgUrl,
      pid: v.id,
    }));
  }
}

// 更新页面
function updatePage(page: number) {
  pageRef = page;
  const cat = curCategoryRef === "全部歌单" ? undefined : curCategoryRef;
  const offset = (page - 1) * limit;
  updatePlaylist(cat, offset, limit);
}
</script>

<template>
  <KeepAlive>
    <div class="category-container" @click="showCategoryPanelRef = false">
      <!-- 导航栏 -->
      <div class="nav">
        <div class="tablebar">
          <!-- 分类按钮 -->
          <div
            class="label"
            @click.stop="showCategoryPanelRef = !showCategoryPanelRef"
          >
            {{ curCategoryRef }}
          </div>
        </div>
        <!-- 详细种类面板 -->
        <Transition name="category">
          <div class="category" v-show="showCategoryPanelRef" @click.stop>
            <div class="scene" v-for="(v, i) in categorysRef" :key="i">
              <h2 class="name">{{ v.category }}</h2>
              <div class="tag">
                <span
                  class="style"
                  :class="curCategoryRef === item ? 'selected' : ''"
                  v-for="(item, i) in v.styles"
                  :key="i"
                  @click="selectCategoryHandle(item)"
                  >{{ item }}</span
                >
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 歌单列表 -->
      <div class="playlist">
        <CAlbumCard
          class="card"
          v-for="(v, i) in playlistListRef"
          :key="i"
          :name="v.name"
          :pic="v.pic"
          :pid="v.pid"
          @play="playAllHandle"
          @show="showHandle"
        />
      </div>

      <!-- 分页器 -->
      <CPager :page="pageRef" :total="totalRef" :limit="limit" @update="updatePage"/>
    </div>
  </KeepAlive>
</template>

<style scoped lang="scss">
.category-container {
  width: 100%;
  padding: 20px;

  .nav {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    transition: 0.3s;
    padding: 8px;

    .tablebar {
      .label {
        padding: 10px 20px;
        font-size: 2.5em;
        text-align: center;
        width: fit-content;
        user-select: none;
        font-weight: 800;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 8px;

        &:hover {
          // text-decoration: underline;
          border: 2px solid var(--primary);
        }
      }
    }

    .category {
      width: 100%;
      border: 1px solid var(--info);
      padding: 8px;
      border-radius: 8px;

      .scene {
        width: 100%;
        padding: 5px 0;
        display: flex;

        .name {
          font-size: 1.2em;
          margin-right: 20px;
          flex-shrink: 0;
          padding: 5px 10px;
        }

        .tag {
          display: flex;
          flex-wrap: wrap;
          align-self: center;

          .style {
            font-size: 1em;
            color: var(--color-a50);
            margin: 0 10px 10px 0;
            cursor: pointer;
            user-select: none;
            padding: 5px 10px;
            border-radius: 5px;

            &.selected {
              color: #fff;
              background-color: var(--primary);
            }

            &:hover {
              color: #fff;
              background-color: var(--primary);
            }
          }
        }
      }
    }
  }

  .playlist {
    width: 100%;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
    justify-items: center;
    overflow: hidden;
  }
}
</style>
