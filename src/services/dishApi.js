import request from "../utils/request";
import { BaseApi } from "../config";

const baseApi = BaseApi + "/dish";

export const getDishsApi = function(data = {}) {
  return request(baseApi, {
    method: "get",
    data
  });
};
export const getDishApi = function(id) {
  return request(`${baseApi}/${id}`, {
    method: "get",
    data: {}
  });
};
export const addDishApi = function(data = {}) {
  return request(baseApi, {
    method: "post",
    data
  });
};
export const updateDishApi = function(data = {}) {
  return request(baseApi, {
    method: "put",
    data
  });
};
export const updateDishStatusApi = function(data = {}) {
  return request(`${baseApi}/status`, {
    method: "put",
    data
  });
};