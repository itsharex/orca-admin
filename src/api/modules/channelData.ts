import http from "@/api";
/**
 * @name 渠道数据模块
 */
//获取时间维度数据列表
export const getTimeDimensionData = (params: any) => {
  return http.get("v1/channel/data/time/dimension", params);
};
// 时间维度详情
export const getTimeDimensionDetail = (params: any) => {
  return http.get("v1/channel/data/time/dimension/detail", params);
};
// 时间维度看板统计数据
export const getTimeDimensionBoard = (date: any) => {
  return http.get(`/v1/channel/data/time/dimension/board/${date}`);
};
//获取渠道维度数据列表
export const getChannelDimensionData = (params: any) => {
  return http.get("/v1/channel/data/channel/dimension", params);
};
// 渠道维度详情
export const getChanneleDimensionDetail = (id: any) => {
  return http.get(`/v1/channel/data/channel/dimension/detail?id=${id}`);
};
// 渠道维度看板统计数据
export const getChannelDimensionBoard = (date: any) => {
  return http.get(`/v1/channel/data/channel/dimension/board/${date}`);
};
//获取直播维度数据列表
export const getLivingDimensionData = (params: any) => {
  return http.get("/v1/channel/data/living/dimension", params);
};
// 直播维度看板统计数据
export const getLivingDimensionBoard = (roomId: any) => {
  return http.get(`/v1/channel/data/living/dimension/board/${roomId}`);
};
// 分享内容
export const channelShare = (roomId: any, params: any) => {
  return http.get(`/v1/stream/e2e/${roomId}`, params);
};
// 渠道列表
export const channelAll = () => {
  return http.get(`/v1/channel/all`);
};
