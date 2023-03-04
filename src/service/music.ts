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