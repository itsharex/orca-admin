import http from "@/api";
import { Channel } from "@/api/interface/index";
/**
 * @name 渠道管理模块
 */
//获取渠道管理列表
export const getChannelList = (params: Channel.ChannelList) => {
  return http.get("/v1/channel", params);
};
//新增渠道
export const addChannel = (params: { id: string }) => {
  return http.post(`/v1/channel`, params);
};
//编辑渠道
export const updateChannel = (params: { id: string }) => {
  return http.put(`/v1/channel`, params);
};
// 删除渠道
export const ChannelDelete = (params: any) => {
  return http.delete(`/v1/channel/${params}`);
};

//获取下拉框列表
export const getSelectList = (params: any) => {
  return http.get("/v1/channel/init", params);
};
