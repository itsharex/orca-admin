import http from "@/api";
import { Gift } from "@/api/interface/index";
/**
 * @name 客服管理模块
 */
//获取客服列表
export const getCSList = (params: Gift.GiftList) => {
  return http.get("/v1/org/cs", params);
};
//新增客服
export const addCS = (params: { id: string }) => {
  return http.post(`/v1/org/cs`, params);
};
//编辑客服
export const updateCS = (params: { roleId: string }) => {
  return http.put(`/v1/org/cs`, params);
};
// 删除客服
export const CSDelete = (params: any) => {
  return http.delete(`/v1/org/cs/${params}`);
};
