import request from "@/utils/request";
import { encryptedData } from "@/utils/encrypt";
import { loginRSA, tokenName } from "@/config/settings";

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data);
  }
  return request({
    url: "/sys/login",
    method: "post",
    data,
  });
}

export function getSlipCount(data) {
  return request({
    url: "/sys/slipCount",
    method: "get",
    params: data,
  });
}

export function getUserInfo(accessToken) {
  return request({
    url: "/api/v1/sys/user/getInfo",
    method: "get",
    headers: {
      [tokenName]: accessToken
    }
  });
}

export function logout() {
  return request({
    url: "/sys/logout",
    method: "post",
  });
}

export function register() {
  return request({
    url: "/register",
    method: "post",
  });
}
