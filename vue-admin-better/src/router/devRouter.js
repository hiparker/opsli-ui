import Layout from "@/layouts";
import { filterAllRoutes } from "@/utils/handleRoutes";

/**
 * 该路由 只在开发环境下生效
 * 生产环境下不会打包该路由
 */

// 默认设置一下首页 不可关闭
export const devRoutes = [
  {
    type: 1,
    redirect: "noRedirect",
    path: "/vab",
    component: "Layout",
    name: "Vab 组件试例",
    alwaysShow: true,
    meta: { title: "Vab 组件试例", icon: "box-open" },
    children: [
      {
        type: 1,
        path: "icon",
        component: "EmptyLayout",
        redirect: "noRedirect",
        name: "Icon",
        meta: {
          title: "图标",
        },
        children: [
          {
            type: 1,
            redirect: null,
            path: "awesomeIcon",
            name: "AwesomeIcon",
            component: "views/vab/icon/index",
            meta: { title: "常规图标" },
          },
          {
            type: 1,
            redirect: null,
            path: "colorfulIcon",
            name: "ColorfulIcon",
            component: "views/vab/icon/colorfulIcon",
            meta: { title: "多彩图标" },
          },
        ],
      },
      {
        path: "table",
        component: "views/vab/table/index",
        name: "Table",
        meta: {
          title: "表格",
        },
      },
      {
        path: "map",
        component: "views/vab/map/index",
        name: "Map",
        meta: {
          title: "地图",
        },
      },

      {
        path: "webSocket",
        name: "WebSocket",
        component: "views/vab/webSocket/index",
        meta: { title: "webSocket" },
      },
      {
        path: "form",
        name: "Form",
        component: "views/vab/form/index",
        meta: { title: "表单" },
      },
      {
        path: "element",
        name: "Element",
        component: "views/vab/element/index",
        meta: { title: "常用组件" },
      },
      {
        path: "tree",
        name: "Tree",
        component: "views/vab/tree/index",
        meta: { title: "树" },
      },
      {
        path: "menu1",
        component: "views/vab/nested/menu1/index",
        name: "Menu1",
        alwaysShow: true,
        meta: {
          title: "嵌套路由 1",
        },
        children: [
          {
            path: "menu1-1",
            name: "Menu1-1",
            alwaysShow: true,
            meta: { title: "嵌套路由 1-1" },
            component: "views/vab/nested/menu1/menu1-1/index",

            children: [
              {
                path: "menu1-1-1",
                name: "Menu1-1-1",
                meta: { title: "嵌套路由 1-1-1" },
                component: "views/vab/nested/menu1/menu1-1/menu1-1-1/index",
              },
            ],
          },
        ],
      },
      {
        path: "loading",
        name: "Loading",
        component: "views/vab/loading/index",
        meta: { title: "loading" },
      },
      {
        path: "backToTop",
        name: "BackToTop",
        component: "views/vab/backToTop/index",
        meta: { title: "返回顶部" },
      },
      {
        path: "lodash",
        name: "Lodash",
        component: "views/vab/lodash/index",
        meta: { title: "lodash" },
      },
      {
        path: "smallComponents",
        name: "SmallComponents",
        component: "views/vab/smallComponents/index",
        meta: { title: "小组件" },
      },

      {
        path: "upload",
        name: "Upload",
        component: "views/vab/upload/index",
        meta: { title: "上传" },
      },
      {
        path: "log",
        name: "Log",
        component: "views/vab/errorLog/index",
        meta: { title: "错误日志模拟" },
      },
      {
        path: "https://github.com/hiparker/opsli-boot",
        name: "ExternalLink",
        type: 3,
        meta: {
          title: "外链",
          target: "_blank",
          permissions: ["admin", "editor"],
          badge: "New",
        },
      },
    ],
  },
];

export default { devRoutes };
