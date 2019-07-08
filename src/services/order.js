import request from "../utils/request";
import { message } from "antd";
import { BaseApi } from "../config";

const baseApi = BaseApi + "/order";

export const getOrdersApi = function(data = {}) {
  return request(baseApi, {
    method: "get",
    data
  });
};
export const getOrderApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "get"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const addOrdersApi = function(data = {}) {
  return request(baseApi, {
    method: "post",
    data
  });
};
export const deleteOrderApi = function(id) {
  if (id) {
    return request(`${baseApi}/${id}`, {
      method: "delete"
    });
  } else {
    message.error("id不能为空");
    return Promise.reject("id不能为空");
  }
};
export const updateOrderApi = function(data = {}) {
  return request(baseApi, {
    method: "put",
    data
  });
};
export const getOrderDishApi = function(id) {
  return request(`${baseApi}/${id}/dishs`, {
    method: "get"
  });
};
export const updateOrderStatusApi = function(data = {}) {
  return request(`${baseApi}/status`, {
    method: "put",
    data
  });
};