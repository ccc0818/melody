import axios from "@/plugins/axios";
import { SongLevel } from './types'


/**
 * 搜索音乐
 * @param search 
 * @param offset 
 * @param limit 
 * @returns 
 */
export function searchSong(search: string, offset:number, limit: number = 20) { 
  return axios.get(`/cloudsearch?keywords=${search}&limit=${limit}&offset=${offset}`);
}

/**
 * 根据id获得音乐
 * @param id 
 * @param level 
 * @returns 
 */
export function getSongV1(id: number, level: SongLevel = SongLevel.standard) {
  return axios.get(`/song/url/v1?id=${id}&level=${level}`);
}

/**
 * 根据ID获取歌词
 * @param id 
 * @returns 
 */
export function getLyric(id: number) { 
  return axios.get(`/lyric?id=${id}`);
}

/**
 * 获取音乐详情
 * @param ids 
 * @returns 
 */
export function getMusicDetail(ids: number[]) { 
  return axios.get(`/song/detail?ids=${ids}`);
}

/**
 * 获取用户喜欢列表
 * @param uid 
 * @returns 
 */
export function getMusicsOfLike(uid: number) { 
  return axios.get(`/likelist?uid=${uid}`);
}

/**
 * 设置喜欢 
 * @param id 
 * @param like 
 * @returns  成功code 为200 否则就是失败 
 */
export function setLike(id: number, like: boolean = true) { 
  return axios.get(`like?id=${id}&like=${like}`)
}

/**
 * 获取用户歌单
 * @param uid 
 * @param offset 
 * @param limit 
 * @returns 
 */
export function getUserPlaylist(uid: number, offset: number = 0, limit: number = 30) { 
  return axios.get(`/user/playlist?uid=${uid}&offset=${offset}&limit=${limit}`) as any;
}

/**
 * 获取歌单详情
 * @param pid 
 * @returns 
 */
export function getPlaylistDetail(pid: number) { 
  return axios.get(`/playlist/detail?id=${pid}`) as any;
}

/**
 * 获取歌单内所有的歌曲
 * @param pid 
 * @returns 
 */
export function getPlaylistMusics(pid: number) { 
  return axios.get(`/playlist/track/all?id=${pid}`) as any;
}