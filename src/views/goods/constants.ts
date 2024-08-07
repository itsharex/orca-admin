//支付类型
export const PAYTYPE = [
  { key: 1, name: "跳转支付" },
  { key: 2, name: "在线支付" },
  { key: 3, name: "小程序支付" }
] as const;

//商品类型
export const GOODSTYPE = [
  { key: 1, name: "虚拟商品" },
  { key: 2, name: "实体商品" }
] as const;

//商品限单
export const GOODS_BOUNDS = [
  { key: 0, name: "否" },
  { key: 1, name: "是" }
] as const;
