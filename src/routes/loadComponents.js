import Loadable from "react-loadable";
import RouterLoading from "../components/RouterLoading";

export const Login = Loadable({
  loader: () => import("../pages/Login"),
  loading: RouterLoading
});
export const IndexLayout = Loadable({
  loader: () => import("../layouts/IndexLayout"),
  loading: RouterLoading
});
export const ErrorPage = Loadable({
  loader: () => import("../pages/ErrorPage"),
  loading: RouterLoading
});

export const MerchantManage = Loadable({
  loader: () => import("../pages/admin/MerchantManage"),
  loading: RouterLoading
});
export const AddMerchant = Loadable({
  loader: () => import("../pages/admin/MerchantManage/AddMerchant"),
  loading: RouterLoading
});
export const EditMerchant = Loadable({
  loader: () => import("../pages/admin/MerchantManage/EditMerchant"),
  loading: RouterLoading
});
export const AuditMerchant = Loadable({
  loader: () => import("../pages/admin/MerchantManage/AuditMerchant"),
  loading: RouterLoading
});

export const MerchantInfo = Loadable({
  loader: () => import("../pages/merchant/MerchantInfo"),
  loading: RouterLoading
});
export const EditMerchantInfo = Loadable({
  loader: () => import("../pages/merchant/MerchantInfo/EditMerchantInfo"),
  loading: RouterLoading
});