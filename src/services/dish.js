import request from "../utils/request";
import { message } from "antd";
import { BaseApi } from "../config";

const baseApi = BaseApi + "/dish";

export const getDishsApi = function(data = {}) {
  return request(baseApi, {
    method: "get",
    data
  });
};
export const getDishAllApi = function(data = {}) {
  return request(`${baseApi}/all`, {
    method: "get",
    data
  });
};
export const getDishApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "get"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const addDishsApi = function(data = {}) {
  return request(baseApi, {
    method: "post",
    data
  });
};
export const deleteDishApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "delete"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const updateDishApi = function(data = {}) {
  return request(baseApi, {
    method: "put",
    data
  });
};
export const getDishMaterialApi = function(id) {
  return request(`${baseApi}/${id}/materials`, {
    method: "get"
  });
};
export const updateDishStatusApi = function(data = {}) {
  return request(`${baseApi}/status`, {
    method: "put",
    data
  });
};