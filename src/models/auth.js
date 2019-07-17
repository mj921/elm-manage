import { routeConfig } from "../routes/routeConfig";
import { loginApi, logoutApi } from "../services/commonApi";
import { message } from "antd";
import { routerRedux } from "dva/router";
import { MerchantStatusText, MerchantStatus } from "../config/Enums";
const userInfo = localStorage.getItem("userInfo");
const MerchantStatusObj = {};
Object.keys(MerchantStatus).forEach(key => {
  MerchantStatusObj[MerchantStatus[key]] = MerchantStatusText[key];
});
export default {
  namespace: "auth",
  state: {
    username: localStorage.getItem("username") || "",
    userInfo: userInfo ? JSON.parse(userInfo) : {},
    breadcrumb: [],
    selectedKey: localStorage.getItem("selectedKey") || "",
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        dispatch({
          type: "pathnameChange",
          payload: location.pathname
        });
      });
    },
  },
  effects: {
    *pathnameChange({ payload: pathname }, { call, put }) {
      yield put({
        type: "updateBreadcrumb",
        payload: pathname
      });
      let route = routeConfig[pathname];
      let _pathname = pathname;
      while(!route && _pathname.length > 0) {
        let arr = _pathname.split("/");
        _pathname = arr.slice(0, arr.length - 1).join("/");
        route = routeConfig[_pathname];
      }
      if (route && route.selectedKey) {
        yield put({
          type: "UPDATE_SELECTEDKEY",
          payload: route.selectedKey
        });
      }
    },
    *login({ payload: { username, password } }, { call, put }) {
      let result;
      yield loginApi({ username, password }).then(res => {
        localStorage.setItem("token", res.data.token);
        result = res.data;
      });
      yield put({
        type: "UPDATE_USERINFO",
        payload: result
      });
      message.success("登录成功");
      yield put({
        type: "UPDATE_USERNAME",
        payload: username
      });
      yield put(routerRedux.push("/"));
    },
    *logout({ payload }, { call, put }) {
      yield logoutApi().then(res => {
        message.success("退出成功");
      });
      yield put({
        type: "UPDATE_USERNAME",
        payload: ""
      });
    },
    *updateStatus({ payload: status }, { call, put }) {
      yield put({
        type: "UPDATE_STATUS",
        payload: status
      });
    }
  },
  reducers: {
    updateBreadcrumb(state, { payload: pathname }) {
      let breadcrumb = [];
      let pathnames = pathname.split("/");
      let currPath = true;
      while (pathnames.length > 1) {
        let route = routeConfig[pathnames.join("/")];
        if (route) {
          breadcrumb.unshift({
            label: route.label,
            path: currPath ? undefined : pathnames.join("/")
          });
          currPath = false;
        }
        pathnames = pathnames.splice(0, pathnames.length - 1);
      }
      localStorage.setItem("breadcrumb", JSON.stringify(breadcrumb));
      return {
        ...state,
        breadcrumb
      };
    },
    UPDATE_SELECTEDKEY(state, { payload: selectedKey }) {
      localStorage.setItem("selectedKey", selectedKey);
      state.selectedKey = selectedKey;
      return {
        ...state
      };
    },
    UPDATE_USERNAME(state, { payload: username }) {
      localStorage.setItem("username", username);
      state.username = username;
      return {
        ...state
      };
    },
    UPDATE_USERINFO(state, { payload: userInfo }) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      state.userInfo = {
        ...userInfo
      };
      return {
        ...state
      };
    },
    UPDATE_STATUS(state, { payload: status }) {
      state.userInfo = {
        ...state.userInfo,
        status,
        statusStr: MerchantStatusObj[status]
      };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      return {
        ...state
      };
    }
  }
};
