import { MerchantManage } from "./loadComponents";

const adminRoutes = {
  "/merchant-manage": {
    path: "/merchant-manage",
    label: "商户管理",
    component: MerchantManage,
    selectedKey: "merchant-manage"
  }
};
const merchantRoutes = {
  "/merchant-manage1": {
    path: "/merchant-manage",
    label: "商户管理1",
    component: MerchantManage,
    selectedKey: "merchant-manage"
  }
};

export const routeConfig = {
  ...adminRoutes,
  ...merchantRoutes
};
export const routeList = {
  adminRoutes: Object.keys(adminRoutes).map(key => adminRoutes[key]),
  merchantRoutes: Object.keys(merchantRoutes).map(key => merchantRoutes[key])
};