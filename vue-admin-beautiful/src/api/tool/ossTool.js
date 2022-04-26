import request from "@/utils/request";

export function doUpload(data) {
  return request({
    url: "/api/v1/tools/oss/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}
