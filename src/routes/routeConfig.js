import { MerchantManage, AddMerchant, EditMerchant, AuditMerchant, MerchantInfo, EditMerchantInfo } from "./loadComponents";

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
    label: "编辑",
    component: EditMerchantInfo,
    selectedKey: "merchant-info"
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