import http from "@/api";

export const getOrderInfoList = (params: any) => {
  return http.get("/v1/order", params);
};

export const exportOrderInfoList = (params: any) => {
  return http.get("/v1/order/export", params, { responseType: "blob" });
};
