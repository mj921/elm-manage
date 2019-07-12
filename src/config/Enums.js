export const ALL = 99;

/** 通用状态 */
export const BaseStatus = {
  /** 全部 */
  All: ALL,
  /** 启用 */
  Enabled: 1,
  /** 禁用 */
  Disabled: 0
};
/** 通用状态文案 */
export const BaseStatusText = {
  All: "全部",
  Enabled: "启用",
  Disabled: "禁用"
};
/** 商户状态 */
export const MerchantStatus = {
  /** 全部 */
  All: ALL,
  /** 待审核 */
  WaitAudit: 0,
  /** 待开业 */
  WaitOpen: 1,
  /** 开业 */
  Open: 2,
  /** 休息 */
  Rest: 3,
  /** 封禁 */
  Disabled: 4,
  /** 审核不通过 */
  AuditFalied: -1
};
/** 商户状态 */
export const MerchantStatusText = {
  /** 全部 */
  All: "全部",
  /** 待审核 */
  WaitAudit: "待审核",
  /** 待开业 */
  WaitOpen: "待开业",
  /** 开业 */
  Open: "开业",
  /** 休息 */
  Rest: "休息",
  /** 封禁 */
  Disabled: "封禁",
  /** 审核不通过 */
  AuditFalied: "审核不通过"
};