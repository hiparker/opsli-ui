/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */
import Layout from "@/layouts";

// 默认设置一下首页 不可关闭
export const constantRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "index",
    meta: {
      title: "首页",
      icon: "home",
    },
    id: "0-0",
    order: 0,
    type: "1",
    parentId: "0",
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/index/index"),
        meta: {
          title: "首页",
          affix: true,
        },
      },
    ],
  },
];

export default { constantRoutes };
