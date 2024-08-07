import http from "@/api";
import { Gift } from "@/api/interface/index";
/**
 * @name 免审词库管理模块
 */
//获取免审词库列表
export const getWordList = (params: Gift.GiftList) => {
  return http.get("v1/org/word/exempt", params);
};
//新增免审词库
export const addWord = (params: { id: string }) => {
  return http.post(`/v1/org/word/exempt`, params);
};
//编辑免审词库
export const updateWord = (params: { id: string }) => {
  return http.put(`/v1/org/word/exempt`, params);
};
// 删除免审词库
export const WordDelete = (params: any) => {
  return http.delete(`/v1/org/word/exempt/${params}`);
};
