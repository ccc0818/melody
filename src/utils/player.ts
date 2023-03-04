import useStore from "@/store";

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
    window.addEventListener('beforeunload', () => { 
      this.pause()
    })
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
      this.muted = false
    }

    this._audio.volume = volume;
  }

  set muted(muted: boolean) {
    this._audio.muted = muted;

    const { playerStore } = useStore() 
    const { setPlayerState } = playerStore
      setPlayerState({
      muted: muted,
    });
  }

  get analyzer() {
    return this._analyzer;
  }

  async play(id?: number) {
    const { musicStore } = useStore();
    const { setMusicId } = musicStore;
    if (id !== undefined) {
      const res = await setMusicId(id);
      if (res) {
        this._audio.src = res.url;
        this._audio.crossOrigin = "anonymous"; // 开启跨域
        this._audio.play();
      }
    } else {
      this._audio.play();
    }
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
