import http from "@/api";
import { Gift } from "@/api/interface/index";
/**
 * @name 敏感词库管理模块
 */
//获取敏感词库列表
export const getSensitiveList = (params: Gift.GiftList) => {
  return http.get("v1/org/word/sensitive", params);
};
//新增敏感词库
export const addSensitive = (params: { id: string }) => {
  return http.post(`/v1/org/word/sensitive`, params);
};
//编辑敏感词库
export const updateSensitive = (params: { id: string }) => {
  return http.put(`/v1/org/word/sensitive`, params);
};
// 删除敏感词库
export const SensitiveDelete = (params: any) => {
  return http.delete(`/v1/org/word/sensitive/${params}`);
};
