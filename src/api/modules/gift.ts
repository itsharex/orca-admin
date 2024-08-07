import http from "@/api";
import { Gift } from "@/api/interface/index";
/**
 * @name 礼物管理模块
 */
//获取礼物列表
export const getGiftList = (params: Gift.GiftList) => {
  return http.get("/v1/org/gift", params);
};
//新增礼物
export const addGift = (params: { id: string }) => {
  return http.post(`/v1/org/gift`, params);
};
//编辑礼物
export const updateGift = (params: { id: string }) => {
  return http.put(`/v1/org/gift`, params);
};
// 删除礼物
export const GiftDelete = (params: any) => {
  return http.delete(`/v1/org/gift/${params}`);
};
