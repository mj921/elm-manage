import request from "../utils/request";
import { BaseApi } from "../config";
import { message } from "antd";

const baseApi = BaseApi + "/menu";

export const getMenusApi = function(data = {}) {
  return request(baseApi, {
    method: "get",
    data
  });
};
export const getMenuApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "get"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const addMenusApi = function(data = {}) {
  return request(baseApi, {
    method: "post",
    data
  });
};
export const deleteMenuApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "delete"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const updateMenuApi = function(data = {}) {
  return request(baseApi, {
    method: "put",
    data
  });
};
export const getMenuDishApi = function(id) {
  return request(`${baseApi}/${id}/dishs`, {
    method: "get"
  });
};
export const updateMenuStatusApi = function(data = {}) {
  return request(`${baseApi}/status`, {
    method: "put",
    data
  });
};