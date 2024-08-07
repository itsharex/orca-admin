import http from "@/api";
/**
 * @name 房间配置模块
 */
//房间扩展配置列表
export const getExtendList = (params: any) => {
  return http.get(`/v1/room/extend/${params}`);
};
//保存页面配置
export const extendPage = (id: any, params: { id: string }) => {
  return http.post(`/v1/room/extend/${id}/page`, params);
};
//保存互动设置
export const extendInteract = (id: any, params: { id: string }) => {
  return http.post(`/v1/room/extend/${id}/interact`, params);
};
//保存权限配置
export const extendPermission = (id: any, params: { id: string }) => {
  return http.post(`/v1/room/extend/${id}/permission`, params);
};
//保存商品设置
export const extendGoodsItem = (id: any, params: { id: string }) => {
  return http.post(`/v1/room/extend/${id}/goods/item`, params);
};
//保存商品设置
export const extendGoods = (id: any, params: { id: string }) => {
  return http.post(`/v1/room/extend/${id}/goods`, params);
};
//保存礼品配置
export const extendGiftItem = (id: any, params: { id: string }) => {
  return http.post(`/v1/room/extend/${id}/gift/item`, params);
};

//模版保存
export const templateSave = (params: any) => {
  return http.post(`/v1/org/word/template`, params);
};
//获取模版
export const getTemplate = (params: string) => {
  return http.get(`/v1/org/word/template?type=${params}`);
};
