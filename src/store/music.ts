import { defineStore, storeToRefs } from "pinia";
import {
  getSongV1,
  getLyric,
  searchSong,
  getMusicDetail,
} from "@/service/music";
import usePlayerStore, { PlayMode } from "./player";
import { getRandom } from "@/utils/getRandom";
import { showMessage } from "@/utils";

export enum Fee {
  free = 0, // 免费或者无版权
  vip = 1, // vip歌曲
  purchase = 4, // 购买专辑
  viphigh = 8, // 非会员可免费播放低音质，会员可播放高音质及下载
}

export interface IMusicDetail {
  id: number;
  musicName: string;
  singers: string[];
  picUrl: string;
  fee: Fee;
  url: string;
  lyric: string;
  album: string;
  pushTime: number;
}

interface IMusicState {
  musicDetail: IMusicDetail;
  index: number;
  playList: Partial<IMusicDetail>[];
}

const useMusicStore = defineStore("music", () => {
  const musicState = ref<IMusicState>({
    musicDetail: {
      id: 0,
      musicName: "",
      singers: [],
      picUrl: "",
      url: "",
      fee: Fee.free,
      lyric: "",
      album: "",
      pushTime: 0,
    },
    index: 0,
    playList: [],
  });

  function setMusicDetail(obj: Partial<IMusicDetail>) {
    musicState.value.musicDetail = {
      ...musicState.value.musicDetail,
      ...obj,
    };
  }

  async function setMusicId(id: number) {
    const music = (await getSongV1(id)) as any;
    const detail = (await getMusicDetail([id])) as any;
    const lyric = (await getLyric(id)) as any;
    const song = detail.songs[0];

    const musicDetail = {
      id,
      musicName: song.name,
      singers: song.ar.map((v: any) => v.name),
      fee: song.fee,
      picUrl: song.al.picUrl,
      url: music.data[0].url,
      lyric: lyric.lrc.lyric,
    };
    setMusicDetail(musicDetail);

    return musicDetail;
  }

  function addToPlayList(musics: Partial<IMusicDetail>[]) {
    musics.forEach(v => {
      musicState.value.playList.push(v);
    });

    showMessage({
      type: "success",
      message: `${musics.length}首歌已添加到播放列表`,
    });

    return musicState.value.playList.length;
  }

  function delFromPlayList(index: number) {
    musicState.value.playList.splice(index, 1);
  }

  function setPlayList(musics: Partial<IMusicDetail>[]) {
    musicState.value.playList = musics;
    showMessage({
      type: "success",
      message: `播放列表已更新为当前歌单`,
    });
  }

  function clearPlayList() {
    musicState.value.playList.length = 0;
  }

  function setIndex(i: number) {
    musicState.value.index = i;
  }

  async function search(query: string, offset = 0, limit = 20) {
    if (query === "") return;

    const res = (await searchSong(query, offset, limit)) as any;
    return res.result;
  }

  async function switchMusic(next: boolean = true) {
    function nextId() {
      let newIdx = musicState.value.index + 1;
      if (newIdx >= musicState.value.playList.length) {
        newIdx = 0;
      }
      setIndex(newIdx);
      return musicState.value.playList[newIdx].id;
    }

    function prevId() {
      let newIdx = musicState.value.index - 1;
      if (newIdx < 0) {
        newIdx = musicState.value.playList.length - 1;
      }
      setIndex(newIdx);
      return musicState.value.playList[newIdx].id;
    }

    // 判断当前模式
    let id = musicState.value.musicDetail.id;
    const playerStore = usePlayerStore();
    const { playerState } = storeToRefs(playerStore);

    if (playerState.value.playmode === PlayMode.listCircle) {
      if (next) {
        id = nextId() as number;
      } else {
        id = prevId() as number;
      }
    } else if (playerState.value.playmode === PlayMode.random) {
      const random = getRandom(0, musicState.value.playList.length);
      id = musicState.value.playList[random].id as number;
      setIndex(random);
    }

    if (id !== musicState.value.musicDetail.id) {
      return await setMusicId(id);
    }

    return musicState.value.musicDetail;
  }

  return {
    musicState,
    setMusicId,
    search,
    addToPlayList,
    clearPlayList,
    setIndex,
    switchMusic,
    setPlayList,
    delFromPlayList,
  };
});

export default useMusicStore;
