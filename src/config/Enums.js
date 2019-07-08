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
/** 订单类型 */
export const OrderType = {
  /** 全部 */
  All: ALL,
  /** 午餐 */
  Lunch: 0,
  /** 晚餐 */
  Dinner: 1
};
/** 订单类型文案 */
export const OrderTypeText = {
  All: "全部",
  Lunch: "午餐",
  Dinner: "晚餐"
};
/** 订单类型 */
export const OrderStatus = {
  /** 全部 */
  All: ALL,
  /** 待处理 */
  ToBeProcessed: 0,
  /** 已处理 */
  Processed: 1,
  /** 已取消 */
  Canceled: -1
};
/** 订单类型文案 */
export const OrderStatusText = {
  All: "全部",
  ToBeProcessed: "待处理",
  Processed: "已处理",
  Canceled: "已取消"
};