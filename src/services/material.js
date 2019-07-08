import request from "../utils/request";
import { message } from "antd";
import { BaseApi } from "../config";

const baseApi = BaseApi + "/material";

export const getMaterialsApi = function(data = {}) {
  return request(baseApi, {
    method: "get",
    data
  });
};
export const getMaterialAllApi = function(data = {}) {
  return request(`${baseApi}/all`, {
    method: "get",
    data
  });
};
export const getMaterialApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "get"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const addMaterialsApi = function(data = {}) {
  return request(baseApi, {
    method: "post",
    data
  });
};
export const deleteMaterialApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "delete"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const updateMaterialApi = function(data = {}) {
  return request(baseApi, {
    method: "put",
    data
  });
};