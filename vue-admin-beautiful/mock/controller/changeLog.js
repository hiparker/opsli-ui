const data = [
  {
    content: "在github上获得了第一个star，感恩一位名叫pbw123的github用户",
    timestamp: "2020-09-11",
  },
  {
    content: "完全开源，发布1.0.0版本",
    timestamp: "2020-11-20",
  },
  {
    content: "完善代码生成器，增加排除表和字段",
    timestamp: "2020-11-22",
  },
  {
    content: "修复 Ehcache 可能会导致Jvm缓存对象共享问题",
    timestamp: "2020-11-24",
  },
  {
    content: "修复群友提出的BUG",
    timestamp: "2020-11-27",
  },
  {
    content: "删除冗余代码",
    timestamp: "2020-11-28",
  },
  {
    content: "修复树级数据无法逐级删除数据问题",
    timestamp: "2020-12-01",
  },
  {
    content:"修复Props 可能空指针异常BUG",
    timestamp: "2020-12-01",
  },
  {
    content: "新增地域模块",
    timestamp: "2020-12-06",
  },
  {
    content: "新增组织机构模块",
    timestamp: "2020-12-07",
  },
  {
    content: "优化登录步骤，失败次数大于系统规定阈值,开启验证码校验，如果失败大于最大次数则封禁账号",
    timestamp: "2020-12-07",
  },
  {
    content: "发布1.1.0版",
    timestamp: "2020-12-08",
  }
];

module.exports = [
  {
    url: "/changeLog/getList",
    type: "post",
    response() {
      return {
        code: 200,
        msg: "success",
        totalCount: 999,
        data: data,
      };
    },
  },
];
