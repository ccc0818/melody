export enum SongLevel {
  standard = "standard", // 标准
  higher = "higher", // 较高
  exhigh = "exhigh", // 极高
  lossless = "lossless", // 无损
  hires = "hires", // Hi-Res
}

export enum CodeState { 
  expire = 800,
  wait = 801,
  waitack = 802,
  access = 803
}