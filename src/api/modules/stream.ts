import http from "@/api";
/**
 * @name 流地址管理
 */
//获取客服列表
export const streamE2e = (params: any) => {
  return http.get(`/v1/stream/e2e/${params}`);
};
//获取推流地址
export const stream = (params: any) => {
  return http.get(`/v1/stream/${params}`);
};
//房间最新一场直播状态
export const liveStatus = (params: any) => {
  return http.get(`/v1/live/${params}`);
};
//开始|关闭直播
export const liveOperate = (operate: any, params: any) => {
  return http.post(`/v1/live/${operate}/${params}`);
};

export const StartVideoLive = (params: any, body: any) => {
  return http.post(`/v1/live/${params}/video/start`, body);
};

export const StopVideoLive = (params: any) => {
  return http.post(`/v1/live/${params}/video/stop`);
};
