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