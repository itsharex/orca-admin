import http from "@/api";
/**
 * @name 机构管理模块
 */
//获取机构列表
export const getInfoList = () => {
  return http.get("/v1/org/info");
};
//重置密码
export const reInfoPwd = (params: any) => {
  return http.post(`/v1/org/info/pwd`, params);
};
//编辑机构
export const updateInfo = (params: { id: string }) => {
  return http.put(`/v1/org/info`, params);
};
