import { MerchantManage, AddMerchant, EditMerchant, AuditMerchant, MerchantInfo, EditMerchantInfo, DishManage, AddDish, EditDish, OrderManage } from "./loadComponents";
import ReserveManage from "../pages/merchant/ReserveManage";

const adminRoutes = {
  "/merchant-manage": {
    path: "/merchant-manage",
    label: "商户管理",
    component: MerchantManage,
    selectedKey: "merchant-manage"
  },
  "/merchant-manage/add": {
    path: "/merchant-manage/add",
    label: "添加商户",
    component: AddMerchant,
    selectedKey: "merchant-manage"
  },
  "/merchant-manage/edit": {
    path: "/merchant-manage/edit/:id",
    label: "编辑商户",
    component: EditMerchant,
    selectedKey: "merchant-manage"
  },
  "/merchant-manage/audit": {
    path: "/merchant-manage/audit/:id",
    label: "审核商户",
    component: AuditMerchant,
    selectedKey: "merchant-manage"
  }
};
const merchantRoutes = {
  "/merchant-info": {
    path: "/merchant-info",
    label: "我的信息",
    component: MerchantInfo,
    selectedKey: "merchant-info"
  },
  "/merchant-info/edit": {
    path: "/merchant-info/edit",
    label: "编辑信息",
    component: EditMerchantInfo,
    selectedKey: "merchant-info"
  },
  "/dish-manage": {
    path: "/dish-manage",
    label: "菜品管理",
    component: DishManage,
    selectedKey: "dish-manage"
  },
  "/dish-manage/add": {
    path: "/dish-manage/add",
    label: "新增菜品",
    component: AddDish,
    selectedKey: "dish-manage"
  },
  "/dish-manage/edit": {
    path: "/dish-manage/edit/:id",
    label: "编辑菜品",
    component: EditDish,
    selectedKey: "dish-manage"
  },
  "/reserve-manage": {
    path: "/reserve-manage",
    label: "预定管理",
    component: ReserveManage,
    selectedKey: "reserve-manage"
  },
  "/order-manage": {
    path: "/order-manage",
    label: "订单管理",
    component: OrderManage,
    selectedKey: "order-manage"
  },
};

export const routeConfig = {
  ...adminRoutes,
  ...merchantRoutes
};
export const routeList = {
  adminRoutes: Object.keys(adminRoutes).map(key => adminRoutes[key]),
  merchantRoutes: Object.keys(merchantRoutes).map(key => merchantRoutes[key])
};