/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from "@/router";
import { deepClone } from "@/utils/clone";
import store from "@/store";
import VabProgress from "nprogress";
import "nprogress/nprogress.css";
import getPageTitle from "@/utils/pageTitle";
import {
  authentication,
  loginInterception,
  progressBar,
  recordRoute,
  routesWhiteList,
} from "./settings";
import { constantRoutes } from "@/router/defaultRouter.js";
import { isNull } from "@/utils/validate";

VabProgress.configure({
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});

router.beforeResolve(async (to, from, next) => {
  if (progressBar) VabProgress.start();
  let hasToken = false;
  let token = store.getters["user/accessToken"];
  if (!isNull(token) && token.length > 0) {
    hasToken = true;
  }
  if (!loginInterception) hasToken = true;
  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      if (progressBar) VabProgress.done();
    } else {
      const hasPermissions =
        store.getters["user/perms"] && store.getters["user/perms"].length > 0;
      if (hasPermissions) {
        next();
      } else {
        try {
          let permissions;
          if (!loginInterception) {
            //settings.js loginInterception为false时，创建虚拟权限
            await store.dispatch("user/setPermissions", ["admin"]);
            permissions = ["admin"];
          } else {
            permissions = await store.dispatch("user/getUserInfo");
          }
          let accessRoutes = [];
          if (authentication === "intelligence") {
            accessRoutes = await store.dispatch(
              "routes/setRoutes",
              permissions
            );
          } else if (authentication === "all") {
            let asyncRoutes = await store.dispatch("routes/setAllRoutes");
            accessRoutes = deepClone([...constantRoutes, ...asyncRoutes]);
          }
          router.addRoutes(accessRoutes);
          next({ ...to, replace: true });
        } catch {
          await store.dispatch("user/resetAccessToken");
          if (progressBar) VabProgress.done();
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (recordRoute) {
        next(`/login?redirect=${to.path}`);
      } else {
        next("/login");
      }

      if (progressBar) VabProgress.done();
    }
  }
  document.title = getPageTitle(to.meta.title);
});
router.afterEach(() => {
  if (progressBar) VabProgress.done();
});
