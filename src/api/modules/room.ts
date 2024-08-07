import http from "@/api";
import { Gift } from "@/api/interface/index";
/**
 * @name 直播间管理模块
 */
//获取直播间列表
export const getRoomList = (params: Gift.GiftList) => {
  return http.get("/v1/room/meta", params);
};
//新增直播间
export const addRoom = (params: { id: string }) => {
  return http.post(`/v1/room/meta`, params);
};
//编辑直播间
export const updateRoom = (params: { id: string }) => {
  return http.put(`/v1/room/meta`, params);
};
// 删除直播间
export const RoomDelete = (params: any) => {
  return http.delete(`/v1/room/meta/${params}`);
};
// 房间密码修改
export const updateRoomPwd = (roomId: any, params: any) => {
  return http.put(`/v1/room/meta/pwd/${roomId}`, params);
};
