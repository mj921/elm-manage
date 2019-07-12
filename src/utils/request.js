import fetch from "dva/fetch";
import { message } from "antd";
import ErrorCode from "../config/errorCode";
import { BaseUrl } from "../config";
import app from "../index";

function parseJSON(response) {
  return response.json();
}

async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 400) {
    const res = await response.json();
    let error;
    if (res && res.message) {
      error = new Error(res.message);
    } else {
      error = new Error(response.statusText);
    }
    error.response = response;
    throw error;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, { data = {}, method = "get" }) {
  url = BaseUrl + url;
  const headers = {
    "content-type": "application/json",
    Authorization: localStorage.getItem("token") || ""
  };
  const opt = {
    method,
    headers
  };
  if (method.toLowerCase() !== "get") {
    opt.body = JSON.stringify(data);
  } else {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      if (url.indexOf("?") > -1) {
        url += `&${keys[0]}=${data[keys[0]]}`;
      } else {
        url += `?${keys[0]}=${data[keys[0]]}`;
      }
      for (let i = 1; i < keys.length; i++) {
        url += `&${keys[i]}=${data[keys[i]]}`;
      }
    }
  }
  return new Promise((resolve, reject) => {
    fetch(url, opt)
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      switch (res.code) {
        case ErrorCode.RequestSuccess:
          resolve(res);
          break;
        case ErrorCode.LoginInvalidation:
          app._history.push("/login");
          message.error(res.message);
          reject(res);
          break;
        default:
          message.error(res.message);
          reject(res);
      }
      setTimeout(() => {
        // delete requestUrls[option.url];
      });

    })
    .catch(err => {
      console.log(err);
      if (err.response) {
        let msg = "error";
        switch (err.response.status) {
          case 400:
            msg = err.message && err.message !== "Bad Request" ? err.message : "请求错误-400";
            break;
          case 401:
            msg = "未授权，请登录-401";
            break;
          case 403:
            msg = "拒绝访问-403";
            break;
          case 404:
            msg = "请求地址出错-404";
            break;
          case 408:
            msg = "请求超时-408";
            break;
          case 500:
            msg = "服务器内部错误-500";
            break;
          case 501:
            msg = "服务未实现-501";
            break;
          case 502:
            msg = "网关错误-502";
            break;
          case 503:
            msg = "服务不可用-503";
            break;
          case 504:
            msg = "网关超时-504";
            break;
          case 505:
            msg = "HTTP版本不受支持-505";
            break;
          default:
            msg = err.message || "error";
        }
        message.error(msg);
        reject({ code: err.response.status, message });
      // setTimeout(() => {
      //   delete requestUrls[option.url];
      // });
      } else {
        message.error("网络错误");
        reject({ code: 404, message: "网络错误" });
      }
    });
  });
}
