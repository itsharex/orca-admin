//分佣方式
export const SHAARING_WAY = [
  { key: 1, name: "自动分佣" },
  { key: 2, name: "手动分佣" }
] as const;
//分佣周期
export const SHAARING_CYCLE = [
  { key: 1, name: "每天结算" },
  { key: 2, name: "T+7结算" },
  { key: 3, name: "T+15结算" },
  { key: 4, name: "T+30结算" }
] as const;
//打款银行账户
export const ACCOUNT_TYPE = [
  { key: 1, name: "对公打款" },
  { key: 2, name: "对私打款" }
] as const;
//结算币种
export const CURRENCY_TYPE = [{ key: 1, name: "人民币(CNY)" }] as const;
