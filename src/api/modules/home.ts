import http from "@/api";
/**
 * @name 首页模块
 */
//获取总共数据
export const getOverviewData = () => {
  return http.get("/v1/org/stats/overview");
};
//获取今日开播房间列表
export const getLatestRoom = () => {
  return http.get("/v1/org/stats/latest/room");
};

//最近一周开播次数统计
export const getLatestDay = () => {
  return http.get("/v1/org/stats/day");
};

// 直播趋势
export const getOverviewTrend = (roomIds: string) => {
  return http.get("/v1/overview/trend?roomIds=" + roomIds);
};

//直播数据
export const getOverviewStatistics = (roomIds: string) => {
  return http.get("/v1/overview/data?roomIds=" + roomIds);
};
