import { getPlaylistMusics } from "@/service";
import useStore from "@/store";
import useMusicStore from "@/store/music";

/**
 * 播放器类
 */
class Player {
  private static _instance: Player | null = null;
  static get instance() {
    if (this._instance === null) {
      this._instance = new Player();
    }
    return this._instance;
  }

  private _audio: HTMLAudioElement = new Audio();
  private _analyzer?: AnalyserNode;

  private constructor() {
    window.addEventListener("beforeunload", () => {
      this.pause();
    });
  }

  get audio() {
    return this._audio;
  }

  set volume(volume: number) {
    if (volume > 1) {
      volume = 1;
    } else if (volume < 0) {
      volume = 0;
    }

    if (this._audio.muted) {
      this.muted = false;
    }

    this._audio.volume = volume;
  }

  set muted(muted: boolean) {
    this._audio.muted = muted;

    const { playerStore } = useStore();
    const { setPlayerState } = playerStore;
    setPlayerState({
      muted: muted,
    });
  }

  get analyzer() {
    return this._analyzer;
  }

  async play(id?: number, index?: number) {
    if (id !== undefined) {
      const { musicStore } = useStore();
      const { setMusicId, addToPlayList, setIndex, musicState } = musicStore;
      const res = await setMusicId(id);
      if (res) {
        if (index !== undefined) {
          // 无需添加到播放列表 本身就在列表中
          setIndex(index);
        } else {
          // 需要添加到播放列表 未传入index
          const fidx = musicState.playList.findIndex((v: any) => v.id === id);
          if (fidx < 0) {
            const length = addToPlayList([res]);
            setIndex(length - 1);
          } else {
            setIndex(fidx);
          }
        }

        this._audio.src = res.url;
        this._audio.crossOrigin = "anonymous"; // 开启跨域
        this._audio.play();
      }
    } else {
      this._audio.play();
    }
  }

  async playAll(pid: number) {
    const resList = await getPlaylistMusics(pid);
    if (resList.code !== 200) {
      return;
    }

    const musics = resList.songs.map((v: any) => {
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

    const { musicStore } = useStore();
    const { clearPlayList, setIndex, setMusicId, setPlayList } = musicStore;
    // 将歌单歌曲替换到播放列表
    clearPlayList();
    setPlayList(musics);
    setIndex(0);
    const res = await setMusicId(musics[0].id as number);
    if (res) {
      this._audio.src = res.url;
      this._audio.crossOrigin = "anonymous"; // 开启跨域
      this._audio.play();
    }
  }

  switchPlay(next: boolean = true) {
    const musicStore = useMusicStore();
    const { switchMusic } = musicStore;
    switchMusic(next).then(res => {
      if (res) {
        this._audio.src = res.url;
        this.play();
      }
    });
  }

  pause() {
    this._audio.pause();
  }

  initAudioCtx(fftsize: number = 128) {
    if (this._analyzer) {
      return;
    }
    const audioCtx = new AudioContext();
    const audioSource = audioCtx.createMediaElementSource(this._audio);
    const audioAnalyzer = audioCtx.createAnalyser();
    audioAnalyzer.fftSize = fftsize;
    audioSource.connect(audioAnalyzer);
    audioAnalyzer.connect(audioCtx.destination);
    this._analyzer = audioAnalyzer;
  }
}

export default Player.instance;
