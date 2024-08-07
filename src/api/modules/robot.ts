import http from "@/api";
import { Gift } from "@/api/interface/index";
/**
 * @name 机器人管理模块
 */
//获取机器人列表
export const getRobotList = (params: Gift.GiftList) => {
  return http.get("/v1/org/robot", params);
};
//新增机器人
export const addRobot = (params: { id: string }) => {
  return http.post(`/v1/org/robot`, params);
};
//编辑机器人
export const updateRobot = (params: { id: string }) => {
  return http.put(`/v1/org/robot`, params);
};
// 删除机器人
export const RobotDelete = (params: any) => {
  return http.delete(`/v1/org/robot/${params}`);
};
