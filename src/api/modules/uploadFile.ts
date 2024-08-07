import http from "@/api";
/**
 * @name 房间配置模块
 */
//上传文件
export const upload = (params: { id: string }) => {
  return http.post(`/v1/upload`, params);
};
