import request from "../utils/request";
import { BaseApi } from "../config";

const baseApi = BaseApi + "/merchant";

export const getMerchantsApi = function(data = {}) {
  return request(baseApi, {
    method: "get",
    data
  });
};
export const getMerchantApi = function(id) {
  return request(`${baseApi}/${id}`, {
    method: "get",
    data: {}
  });
};
export const getMerchantTypesApi = function(id) {
  return request(`${baseApi}/types`, {
    method: "get",
    data: { id }
  });
};
export const addMerchantApi = function(data = {}) {
  return request(baseApi, {
    method: "post",
    data
  });
};
export const updateMerchantApi = function(data = {}) {
  return request(baseApi, {
    method: "put",
    data
  });
};
export const auditMerchantApi = function(data = {}) {
  return request(`${baseApi}/audit`, {
    method: "put",
    data
  });
};
export const updateMerchantStatusApi = function(data = {}) {
  return request(`${baseApi}/status`, {
    method: "put",
    data
  });
};
export const deleteMerchantApi = function(id) {
  return request(`${baseApi}/${id}`, {
    method: "delete",
    data: {}
  });
};