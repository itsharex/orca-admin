import http from "@/api";
import { Video } from "@/api/interface/index";
/**
 * @name 视频管理模块
 */
export const getVideoList = (params: Video.VideoList) => {
  return http.get("/v1/media", params);
};
export const uploadVideo = (params: { id: string }) => {
  return http.post(`/v1/media`, params);
};

export const VideoDelete = (params: any) => {
  return http.delete(`/v1/media/${params}`);
};

export const getVideoLog = (params: { id: number }) => {
  return http.post(`/v1/live/${params}/video/oplog`, {}, { loading: false });
};

export const MEDIA_TYPE = [
  { key: 1, name: "手动上传" },
  { key: 2, name: "从录制而来" }
];

export const BIZ_TYPE = [
  { key: 1, name: "媒体库" },
  { key: 2, name: "直播记录" }
];

export const STATUS = [
  { key: 0, name: "等待启动" },
  { key: 1, name: "运行中" },
  { key: 2, name: "已停止,正常结束(自动｜主动)" },
  { key: 3, name: "已停止且失败" }
];
