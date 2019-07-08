import request from "../utils/request";
import { BaseApi } from "../config";

const baseApi = BaseApi + "/common";

export const getUploadApi = function(data = {}) {
  return request(`${baseApi}/upload`, {
    method: "get",
    data
  });
};
export const loginApi = function(data = {}) {
  return request(`${baseApi}/manage/login`, {
    method: "post",
    data
  });
};
export const logoutApi = function(data = {}) {
  return request(`${baseApi}/manage/logout`, {
    method: "post",
    data
  });
};