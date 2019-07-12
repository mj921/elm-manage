import request from "../utils/request";
import { BaseApi } from "../config";

const baseApi = BaseApi + "/area";

export const getAreasApi = function(parentId) {
  return request(baseApi, {
    method: "get",
    data: { parentId }
  });
};
export const getAreaApi = function(id) {
  return request(`${baseApi}/${id}`, {
    method: "post",
    data: {}
  });
};