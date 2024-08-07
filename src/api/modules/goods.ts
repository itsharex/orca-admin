import http from "@/api";
import { Goods } from "@/api/interface/index";
/**
 * @name 商品管理模块
 */
//获取商品列表
export const getGoodsList = (params: Goods.GoodsList) => {
  return http.get("/v1/org/goods", params);
};
//新增商品
export const addGoods = (params: { id: string }) => {
  return http.post(`/v1/org/goods`, params);
};
//编辑商品
export const updateGoods = (params: { id: string }) => {
  return http.put(`/v1/org/goods`, params);
};
// 删除商品
export const GoodsDelete = (params: any) => {
  return http.delete(`/v1/org/goods/${params}`);
};
