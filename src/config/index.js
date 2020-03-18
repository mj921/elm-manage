import { BASE_API, BASE_URL } from "./api";

export const BaseApi = BASE_API;
export const BaseUrl = BASE_URL;
export const Page = {
  pageSize: 10,
  current: 1,
  pageSizeOptions: ["10", "20", "50", "100"],
  showQuickJumper: true,
  showSizeChanger: true,
  hideOnSinglePage: false,
};
export const qiniuHost = "http://q04p1eawx.bkt.clouddn.com";