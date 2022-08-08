/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from "vue";
import {
  getSlipCount,
  getUserInfo,
  login,
  loginByCode,
  logout,
  sendEmailCode,
  sendMobileCode,
} from "@/api/user";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/utils/accessToken";
import { resetRouter } from "@/router";
import { title, tokenName, encryptRSA } from "@/config/settings";
import { decryptedDes } from "@/utils/crypto/encrypt-des";

const state = {
  accessToken: getAccessToken(),
  username: "",
  avatar: "",
  permissions: [],
  perms: [],
};
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  perms: (state) => state.perms,
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUsername(state, username) {
    state.username = username;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
  setPerms(state, perms) {
    state.perms = perms;
  },
};
const actions = {
  setPermissions({ commit }, permissions) {
    commit("setPermissions", permissions);
  },
  async sendEmailCode({ commit }, form) {
    const { msg } = await sendEmailCode(form);
    Vue.prototype.$baseMessage(msg, "success");
  },
  async sendMobileCode({ commit }, form) {
    const { msg } = await sendMobileCode(form);
    Vue.prototype.$baseMessage(msg, "success");
  },
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo);
    let tmpData = data;
    if (encryptRSA) {
      // 获得公钥
      let publicKey = Vue.prototype.$getPublicKey();
      // 解密数据
      let decryptedStr = decryptedDes(tmpData, publicKey);
      // 转换为Json
      tmpData = JSON.parse(decryptedStr);
    }

    const accessToken = tmpData["accessToken"];
    if (accessToken) {
      commit("setAccessToken", accessToken);
      const hour = new Date().getHours();
      const thisTime =
        hour < 8
          ? "早上好"
          : hour <= 11
          ? "上午好"
          : hour <= 13
          ? "中午好"
          : hour < 18
          ? "下午好"
          : "晚上好";
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`);
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        "error"
      );
    }
  },
  async loginByCode({ commit }, form) {
    const { data } = await loginByCode(form);
    let tmpData = data;
    if (encryptRSA) {
      // 获得公钥
      let publicKey = Vue.prototype.$getPublicKey();
      // 解密数据
      let decryptedStr = decryptedDes(tmpData, publicKey);
      // 转换为Json
      tmpData = JSON.parse(decryptedStr);
    }

    const accessToken = tmpData["accessToken"];
    if (accessToken) {
      commit("setAccessToken", accessToken);
      const hour = new Date().getHours();
      const thisTime =
        hour < 8
          ? "早上好"
          : hour <= 11
          ? "上午好"
          : hour <= 13
          ? "中午好"
          : hour < 18
          ? "下午好"
          : "晚上好";
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`);
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        "error"
      );
    }
  },
  async getUserInfo({ commit, state }) {
    const { data } = await getUserInfo(state.accessToken);
    if (!data) {
      Vue.prototype.$baseMessage("验证失败，请重新登录...", "error");
      return false;
    }
    let { roles, perms, realName, avatar } = data;
    if (roles && realName && Array.isArray(roles)) {
      commit("setPermissions", roles);
      commit("setPerms", perms);
      commit("setUsername", realName);
      if (avatar) {
        commit("setAvatar", avatar);
      } else {
        commit("setAvatar", "");
      }
      return state.permissions;
    } else {
      Vue.prototype.$baseMessage("用户信息接口异常", "error");
      return false;
    }
  },
  // 刷新用户权限
  async refreshUserPerms({ commit, state }) {
    const { data } = await getUserInfo(state.accessToken);
    if (!data) {
      Vue.prototype.$baseMessage("验证失败，请重新登录...", "error");
      return false;
    }
    let { roles, perms } = data;
    if (roles && Array.isArray(roles)) {
      commit("setPermissions", roles);
      commit("setPerms", perms);
      return true;
    } else {
      Vue.prototype.$baseMessage("用户信息接口异常", "error");
      return false;
    }
  },
  async logout({ dispatch }) {
    await logout(state.accessToken);
    await dispatch("resetAccessToken");
    await resetRouter();
  },
  async getSlipCount({ commit }, { username }) {
    return getSlipCount({ username: username });
  },
  resetAccessToken({ commit }) {
    commit("setPermissions", []);
    commit("setPerms", []);
    commit("setAccessToken", "");
    removeAccessToken();
    setTimeout(function () {
      // 清除字典数据
      Vue.prototype.$clearDictList();
    }, 500);
  },
};
export default { state, getters, mutations, actions };
