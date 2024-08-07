// ? 分片上传配置

// 上传分块大小，单位Mb
export const baseChunkSize: number = 5;

// 上传文件的后端接口地址
export const uploadUrl: string = "/v1/upload/part/transport";

// 初始化上传的接口地址
export const vertifyUrl: string = "v1/upload/part/init";

// 请求进行文件合并的接口地址
export const mergeUrl: string = "/v1/upload/part/complete";

// 取消上传文件接口地址
export const cancelUrl: string = "v1/upload/part/cancel";
