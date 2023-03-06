import { defineStore } from "pinia";
import { getSongV1, getLyric, searchSong, getMusicDetail } from "@/service/music";

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
  album: string
  pushTime: number
}

interface IMusicState {
  musicDetail: IMusicDetail;
  historyList: number[];
  playList: number[];
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
      lyric: '',
      album: '',
      pushTime: 0
    },
    historyList: [],
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
    const lyric = await getLyric(id) as any;
    const song = detail.songs[0];
    
    const musicDetail = {
      id,
      musicName: song.name,
      singers: song.ar.map((v: any) => v.name),
      fee: song.fee,
      picUrl: song.al.picUrl,
      url: music.data[0].url,
      lyric: lyric.lrc.lyric
    };
    setMusicDetail(musicDetail);
     
    return musicDetail;
  }

  function addToPlayList(musics: number[]) {
    musicState.value.playList.push(...musics);
  }

  function clearPlayList() {
    musicState.value.playList.length = 0;
  }

  async function search(query: string, offset = 0, limit = 20) {
    if (query === "") return;

    const res = (await searchSong(query, offset, limit)) as any;
    return res.result;
  }

  return {
    musicState,
    setMusicId,
    search,
    addToPlayList,
    clearPlayList,
  };
});

export default useMusicStore;
