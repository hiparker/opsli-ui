<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-alert
          v-if="noticeList[1]"
          :title="noticeList[1].title"
          :closable="noticeList[1].closable"
        >
          <a target="_blank" href="https://github.com/hiparker/opsli-boot">
            <img
              style="height: 100%; margin-right: 10px"
              src="https://img.shields.io/github/stars/hiparker/opsli-boot?style=flat-square&label=Stars&logo=github"
            />
            <img
              style="height: 100%; margin-right: 10px"
              src=" https://img.shields.io/badge/Visitors-79.3k/month-blue?style=flat-square&logo=Visual Studio Code"
            />
            <img
              style="height: 100%; margin-right: 10px"
              src="https://img.shields.io/github/last-commit/hiparker/opsli-boot?style=flat-square&label=Last Commit&logo=vue.js"
            />
          </a>
        </el-alert>

        <el-card shadow="never">
          <div slot="header">
            <span>友情链接：</span>
          </div>
          <div>
            <el-link v-for="(item, index) in links"
                     type="primary"
                     :key="index"
                     :href="item.href"
                     target="_blank"
                     style="margin-right: 10px"
            >{{item.title}}</el-link>
          </div>
        </el-card>

      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>访问量</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="fwl"
          />
          <div class="bottom">
            <span>
              日均访问量:

              <vab-count
                :start-val="config1.startVal"
                :end-val="config1.endVal"
                :duration="config1.duration"
                :separator="config1.separator"
                :prefix="config1.prefix"
                :suffix="config1.suffix"
                :decimals="config1.decimals"
              />
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>授权数</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="sqs"
          />
          <div class="bottom">
            <span>
              总授权数:
              <vab-count
                :start-val="config2.startVal"
                :end-val="config2.endVal"
                :duration="config2.duration"
                :separator="config2.separator"
                :prefix="config2.prefix"
                :suffix="config2.suffix"
                :decimals="config2.decimals"
              />
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card shadow="never">
          <div slot="header">
            <span>词云</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="cy"
            @zr:click="handleZrClick"
            @click="handleClick"
          />
          <div class="bottom">
            <span>
              词云数量:
              <vab-count
                :start-val="config3.startVal"
                :end-val="config3.endVal"
                :duration="config3.duration"
                :separator="config3.separator"
                :prefix="config3.prefix"
                :suffix="config3.suffix"
                :decimals="config3.decimals"
              />
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="13" :xl="13">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>GDP分布图</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="zgdt"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>相关支持</span>
            <div style="float: right">部署时间:{{ updateTime }}</div>
          </div>
          <div class="bottom-btn">
            <el-popover placement="top" width="250" trigger="hover">
              <p>
                免费QQ交流群
              </p>
              <el-image :src="require('@/assets/qq_group.jpg')"></el-image>
              <a slot="reference" target="_blank"
                 href="https://qm.qq.com/cgi-bin/qm/qr?k=vp8fo6JtFKlwzkM6xHlaLWYRA90mvLjM&jump_from=webapi"
                >
                <el-button type="primary">QQ讨论群</el-button>
              </a>
            </el-popover>
            <a @click="handleChangeTheme">
              <el-button type="danger">修改主题和布局</el-button>
            </a>
            <a
              target="_blank"
              href="https://github.com/hiparker/opsli-boot"
            >
              <el-button type="warning">
                github下载源码点star（实时更新）
              </el-button>
            </a>
            <a
              target="_blank"
              href="https://gitee.com/hiparker/opsli-boot"
            >
              <el-button type="warning">码云下载源码点star</el-button>
            </a>
            <el-popover placement="top" width="250" trigger="hover">
              <p>
                谢谢您愿意支持开源
              </p>
              <el-image :src="require('@/assets/wx.jpeg')"></el-image>
              <a slot="reference" target="_blank">
                <el-button type="warning">支持</el-button>
              </a>
            </el-popover>
          </div>

        </el-card>
      </el-col>


      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>前端 - 版本</span>
          </div>
          <table class="table">
            <tr>
              <td style="width: 25%">@vue/cli版本</td>
              <td style="width: 25%">{{ devDependencies["@vue/cli-service"] }}</td>
              <td style="width: 25%">vue版本</td>
              <td style="width: 25%">{{ dependencies["vue"] }}</td>
            </tr>
            <tr>
              <td>vuex版本</td>
              <td>{{ dependencies["vuex"] }}</td>
              <td>vue-router版本</td>
              <td>{{ dependencies["vue-router"] }}</td>
            </tr>
            <tr>
              <td>element-ui版本</td>
              <td>{{ dependencies["element-ui"] }}</td>
              <td>axios版本</td>
              <td>{{ dependencies["axios"] }}</td>
            </tr>
            <tr>
              <td>eslint版本</td>
              <td>{{ devDependencies["eslint"] }}</td>
              <td>prettier版本</td>
              <td>{{ devDependencies["prettier"] }}</td>
            </tr>
            <tr>
              <td>sass版本</td>
              <td>{{ devDependencies["sass"] }}</td>
              <td>mockjs版本</td>
              <td>{{ devDependencies["mockjs"] }}</td>
            </tr>
            <tr>
              <td>zx-layouts版本</td>
              <td>{{ dependencies["zx-layouts"] }}</td>
              <td>lodash版本</td>
              <td>{{ dependencies["lodash"] }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>


      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>后端 - 版本</span>
          </div>
          <table class="table">
            <tr>
              <td style="width: 25%">jdk版本</td>
              <td style="width: 25%">1.8</td>
              <td style="width: 25%">springboot版本</td>
              <td style="width: 25%">2.5.6</td>
            </tr>
            <tr>
              <td>mybatis-plus版本</td>
              <td>3.5.2</td>
              <td>pagehelper版本</td>
              <td>1.3.0</td>
            </tr>
            <tr>
              <td>druid版本</td>
              <td>1.1.17</td>
              <td>dynamic版本</td>
              <td>2.5.4</td>
            </tr>
            <tr>
              <td>fastjson版本</td>
              <td>1.2.83</td>
              <td>transmittable版本</td>
              <td>2.12.5</td>
            </tr>
            <tr>
              <td>ehcache版本</td>
              <td>3.9.0</td>
              <td>easyexcel版本</td>
              <td>2.2.6</td>
            </tr>
            <tr>
              <td>captcha版本</td>
              <td>1.6.2</td>
              <td>guava版本</td>
              <td>30.0-android</td>
            </tr>
            <tr>
              <td>enjoy版本</td>
              <td>4.9.06</td>
              <td>hutool版本</td>
              <td>5.7.14</td>
            </tr>
          </table>
        </el-card>
      </el-col>

      <el-col
        v-for="(item, index) in iconList"
        :key="index"
        :xs="12"
        :sm="6"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <router-link :to="item.link" target="_blank">
          <el-card class="icon-panel" shadow="never">
            <vab-icon
              :style="{ color: item.color }"
              :icon="['fas', item.icon]"
            ></vab-icon>
            <p>{{ item.title }}</p>
          </el-card>
        </router-link>
      </el-col>
      <el-col
        v-if="nodeEnv !== 'development'"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>更新日志</span>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              :color="activity.color"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col
        v-if="nodeEnv !== 'development'"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <el-card shadow="never">
          <div slot="header">
            <span>其他信息</span>
          </div>
          <div style="text-align: center">
            <vab-colorful-icon style="font-size: 140px" icon-class="vab" />
            <h1 style="font-size: 30px">OPSLI 快速开发平台</h1>
          </div>
          <div v-for="(item, index) in noticeList" :key="index">
            <el-alert
              v-if="index !== 0"
              :title="item.title"
              :type="item.type"
              :closable="item.closable"
            ></el-alert>
            <br />
          </div>
          <el-alert :closable="false" :title="userAgent" type="info"></el-alert>
          <br />
        </el-card>
        <el-card shadow="never">
          <div slot="header">
            <span>关于开发者</span>
          </div>
          <img
            src="https://github-readme-stats.vercel.app/api?username=hiparker"
            alt=""
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VabChart from "@/plugins/echarts";
  import { dependencies, devDependencies } from "../../../package.json";
  import { getRepos, getStargazers } from "@/api/github";
  export default {
    name: "Index",
    components: {
      VabChart,
    },
    data() {
      return {
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        nodeEnv: process.env.NODE_ENV,
        dependencies: dependencies,
        devDependencies: devDependencies,
        config1: {
          startVal: 0,
          endVal: this.$baseLodash.random(20000, 60000),
          decimals: 0,
          prefix: "",
          suffix: "",
          separator: ",",
          duration: 8000,
        },
        config2: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: "",
          suffix: "",
          separator: ",",
          duration: 8000,
        },
        config3: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: "",
          suffix: "",
          separator: ",",
          duration: 8000,
        },

        //访问量
        fwl: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: [],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "访问量",
              type: "line",
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
        //授权数
        sqs: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              /*boundaryGap: false,*/
              data: ["0时", "4时", "8时", "12时", "16时", "20时", "24时"],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "授权数",
              type: "bar",
              barWidth: "60%",
              data: [10, 52, 20, 33, 39, 33, 22],
            },
          ],
        },
        //词云
        cy: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
          },
          series: [
            {
              type: "wordCloud",
              gridSize: 15,
              sizeRange: [12, 40],
              rotationRange: [0, 0],
              width: "100%",
              height: "100%",
              textStyle: {
                normal: {
                  color() {
                    const arr = [
                      "#1890FF",
                      "#36CBCB",
                      "#4ECB73",
                      "#FBD437",
                      "#F2637B",
                      "#975FE5",
                    ];
                    let index = Math.floor(Math.random() * arr.length);
                    return arr[index];
                  },
                },
              },
              data: [
                {
                  name: "opsli-boot",
                  value: 15000,
                },
                {
                  name: "element",
                  value: 10081,
                },
                {
                  name: "opsli",
                  value: 9386,
                },

                {
                  name: "vue",
                  value: 6500,
                },
                {
                  name: "parker",
                  value: 6000,
                },
                {
                  name: "good",
                  value: 4500,
                },
                {
                  name: "success",
                  value: 3800,
                },
                {
                  name: "never",
                  value: 3000,
                },
                {
                  name: "boy",
                  value: 2500,
                },
                {
                  name: "girl",
                  value: 2300,
                },
                {
                  name: "github",
                  value: 2000,
                },
                {
                  name: "vue-admin-beautiful",
                  value: 1900,
                },
                {
                  name: "dcloud",
                  value: 1800,
                },
                {
                  name: "china",
                  value: 1700,
                },
                {
                  name: "15321010110",
                  value: 1600,
                },
                {
                  name: "646823972",
                  value: 1500,
                },
                {
                  name: "young",
                  value: 1200,
                },
                {
                  name: "old",
                  value: 1100,
                },
                {
                  name: "vuex",
                  value: 900,
                },
                {
                  name: "router",
                  value: 800,
                },
                {
                  name: "money",
                  value: 700,
                },
                {
                  name: "efficient",
                  value: 800,
                },
                {
                  name: "beijing",
                  value: 9000,
                },
                {
                  name: "author is very cool",
                  value: 9200,
                },
              ],
            },
          ],
        },
        //中国地图
        zgdt: {
          title: {
            text: "2099年全国GDP分布",
            subtext: "数据来自vue-admin-beautiful杜撰",
          },
          tooltip: {
            trigger: "item",
          },
          dataRange: {
            orient: "horizontal",
            min: 0,
            max: 55000,
            text: ["高", "低"],
            splitNumber: 0,
          },
          series: [
            {
              name: "2099年全国GDP分布",
              type: "map",
              roam: false,
              zoom: 1.25,
              mapType: "china",
              mapLocation: {
                x: "center",
              },
              selectedMode: "multiple",
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                },
                emphasis: {
                  label: {
                    show: true,
                  },
                },
              },
              data: [
                { name: "西藏", value: 605.83 },
                { name: "青海", value: 1670.44 },
                { name: "宁夏", value: 2102.21 },
                { name: "海南", value: 2522.66 },
                { name: "甘肃", value: 5020.37 },
                { name: "贵州", value: 5701.84 },
                { name: "新疆", value: 6610.05 },
                { name: "云南", value: 8893.12 },
                { name: "重庆", value: 10011.37 },
                { name: "吉林", value: 10568.83 },
                { name: "山西", value: 11237.55 },
                { name: "天津", value: 11307.28 },
                { name: "江西", value: 11702.82 },
                { name: "广西", value: 11720.87 },
                { name: "陕西", value: 12512.3 },
                { name: "黑龙江", value: 12582 },
                { name: "内蒙古", value: 14359.88 },
                { name: "安徽", value: 15300.65 },
                { name: "北京", value: 16251.93, selected: true },
                { name: "福建", value: 17560.18 },
                { name: "上海", value: 19195.69 },
                { name: "湖北", value: 19632.26 },
                { name: "湖南", value: 19669.56 },
                { name: "四川", value: 21026.68 },
                { name: "辽宁", value: 22226.7 },
                { name: "河北", value: 24515.76 },
                { name: "河南", value: 26931.03 },
                { name: "浙江", value: 32318.85 },
                { name: "山东", value: 45361.85 },
                { name: "江苏", value: 49110.27 },
                { name: "广东", value: 53210.28 },
              ],
            },
          ],
        },

        //更新日志
        reverse: true,
        activities: [],
        noticeList: [],
        links: [
          {
            href: "https://www.opsli.com",
            title: "OPSLI 官方网站"
          },
          {
            href: "https://wiki.opsli.bedebug.com/docs/opsli/opsli-1c83h9o28e1cm",
            title: "OPSLI 官方文档"
          },
          {
            href: "https://www.hutool.cn/",
            title: "Hutool 工具"
          },
          {
            href: "http://www.jeeplus.org",
            title: "jeeplus"
          },
          {
            href: "https://chu1204505056.gitee.io/vue-admin-beautiful-pro/#/index",
            title: "vue-admin-beautiful-pro"
          },
          {
            href: "https://www.bedebug.com",
            title: "在码圈"
          },
        ],
        //其他信息
        userAgent: navigator.userAgent,
        //卡片图标
        iconList: [
          {
            icon: "video",
            title: "视频播放器",
            link: "/vab/player",
            color: "#ffc069",
          },
          {
            icon: "table",
            title: "表格",
            link: "/vab/table/comprehensiveTable",
            color: "#5cdbd3",
          },
          {
            icon: "laptop-code",
            title: "源码",
            link: "https://github.com/hiparker/opsli-boot",
            color: "#b37feb",
          },
          {
            icon: "book",
            title: "书籍",
            link: "",
            color: "#69c0ff",
          },
          {
            icon: "bullhorn",
            title: "公告",
            link: "",
            color: "#ff85c0",
          },
          {
            icon: "gift",
            title: "礼物",
            link: "",
            color: "#ffd666",
          },

          {
            icon: "balance-scale-left",
            title: "公平的世界",
            link: "",
            color: "#ff9c6e",
          },
          {
            icon: "coffee",
            title: "休息一下",
            link: "",
            color: "#95de64",
          },
        ],
      };
    },
    created() {
      this.fetchData();
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    mounted() {
      let base = +new Date(2020, 1, 1);
      let oneDay = 24 * 3600 * 1000;
      let date = [];

      let data = [Math.random() * 1500];
      let now = new Date(base);

      const addData = (shift) => {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/");
        date.push(now);
        data.push(this.$baseLodash.random(20000, 60000));

        if (shift) {
          date.shift();
          data.shift();
        }

        now = new Date(+new Date(now) + oneDay);
      };

      for (let i = 1; i < 6; i++) {
        addData();
      }
      addData(true);
      this.fwl.xAxis[0].data = date;
      this.fwl.series[0].data = data;
      this.timer = setInterval(() => {
        addData(true);
        this.fwl.xAxis[0].data = date;
        this.fwl.series[0].data = data;
      }, 3000);
    },
    methods: {
      handleClick(e) {
        this.$baseMessage(`点击了${e.name},这里可以写跳转`);
      },
      handleZrClick(e) {},
      handleChangeTheme() {
        this.$baseEventBus.$emit("theme");
      },
      async fetchData() {
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
          // =================================
          {
            content: "发布1.1.0版",
            timestamp: "2020-12-08",
          },
          {
            content: "固定线程池, 更换为自定义线程池, 防止线程队列爆炸",
            timestamp: "2020-12-11",
          },
          {
            content: "增加自定义Shiro排除URL",
            timestamp: "2020-12-11",
          },
          {
            content: "修复用户多角色菜单重复BUG",
            timestamp: "2020-12-11",
          },
          {
            content: "ReView优化 符合阿里规范",
            timestamp: "2020-12-11",
          },
          // =================================
          {
            content: "发布1.1.1-beta版",
            timestamp: "2020-12-08",
          },
          {
            content: "新增导入导出Excel功能",
            timestamp: "2020-12-15",
          },
          {
            content: "修复代码生成器多个验证类别无法选择问题",
            timestamp: "2020-12-17",
          },
          {
            content: "修复删除用户后无法新增相同用户BUG",
            timestamp: "2020-12-19",
          },
          {
            content: "修复Redis分布式锁可能解除失败问题",
            timestamp: "2020-12-20",
          },
          {
            content: "优化字典排序问题",
            timestamp: "2020-12-20",
          },
          {
            content: "优化Mybatis-plus 自动填充",
            timestamp: "2020-12-20",
          },
          {
            content: "增加导出按钮防抖处理",
            timestamp: "2020-12-20",
          },
          {
            content: "优化代码结构",
            timestamp: "2020-12-20",
          },
          {
            content: "发布1.1.2-beta版",
            timestamp: "2020-12-21",
          },
          // =================================
          {
            content: "优化登录失败返回状态",
            timestamp: "2020-12-22",
          },
          {
            content: "优化登录验证码校验",
            timestamp: "2020-12-22",
          },
          {
            content: "新增用户重置密码功能",
            timestamp: "2020-12-24",
          },
          {
            content: "优化租户，加入租户缓存提高登录效率",
            timestamp: "2020-12-24",
          },
          {
            content: "登录记录用户IP功能采用异步多线程处理",
            timestamp: "2020-12-24",
          },
          {
            content: "更新地域数据为中国2020最新地域信息",
            timestamp: "2020-12-25",
          },
          {
            content: "升级fastjson与hutool版本",
            timestamp: "2020-12-25",
          },
          {
            content: "优化启动告警项",
            timestamp: "2020-12-29",
          },
          {
            content: "优化系统启动信息",
            timestamp: "2020-12-29",
          },
          {
            content: "优化Redis信道订阅代码",
            timestamp: "2020-12-29",
          },
          {
            content: "扩展登录方式",
            timestamp: "2020-12-30",
          },
          {
            content: "优化缓存工具类",
            timestamp: "2021-01-3",
          },
          {
            content: "新增业务限流器",
            timestamp: "2021-01-5",
          },
          {
            content: "登录增加限流器验证 防止同一IP下 疯狂撞库",
            timestamp: "2021-01-5",
          },
          {
            content: "缓存系统刷新优化",
            timestamp: "2021-01-6",
          },
          {
            content: "内置数据空指针BUG",
            timestamp: "2021-01-6",
          },
          {
            content: "条件构造器代码优化",
            timestamp: "2021-01-6",
          },
          {
            content: "增加搜索历史注解-可记录当前用户检索历史",
            timestamp: "2021-01-7",
          },
          {
            content: "Shiro 认证优化",
            timestamp: "2021-01-8",
          },
          {
            content: "工具类优化",
            timestamp: "2021-01-10",
          },
          {
            content: "组织结构修复更改租户无法逐级修改问题",
            timestamp: "2021-01-11",
          },
          {
            content: "增加开源伙伴提供的系统监控模块",
            timestamp: "2021-01-17",
          },
          // =================================
          {
            content: "发布1.2.0版",
            timestamp: "2021-01-18",
          },
          {
            content: "用户名密码验证加强",
            timestamp: "2021-01-25",
          },
          {
            content: "用户名密码验证加强",
            timestamp: "2021-01-25",
          },
          {
            content: "修复字典缓存刷新BUG",
            timestamp: "2021-01-25",
          },
          {
            content: "Ret返回类优化",
            timestamp: "2021-01-26",
          },
          {
            content: "ReView 拦截器，并加以规范化",
            timestamp: "2021-01-26",
          },
          {
            content: "优化Mybatis自动填充器",
            timestamp: "2021-01-26",
          },
          {
            content: "修复代码生成器 用户多条生成记录数据获取异常问题",
            timestamp: "2021-01-27",
          },
          {
            content: "修复代码生成器 字段长度限制异常",
            timestamp: "2021-01-27",
          },
          {
            content: "修复修改用户刷新缓存无效问题",
            timestamp: "2021-01-28",
          },
          {
            content: "修复代码生成器 生成日期类型BUG",
            timestamp: "2021-01-29",
          },
          {
            content: "代码生成器优化-解决手动更改数据库痛点",
            timestamp: "2021-01-30",
          },
          {
            content: "优化配置文件",
            timestamp: "2021-02-01",
          },
          {
            content: "优化缓存系统模式",
            timestamp: "2021-02-02",
          },
          {
            content: "优化系统工具类",
            timestamp: "2021-02-03",
          },
          {
            content: "优化登录票据",
            timestamp: "2021-02-04",
          },
          {
            content: "增加登录终端限制",
            timestamp: "2021-02-05",
          },
          {
            content: "修复我删我自己行为",
            timestamp: "2021-02-06",
          },
          {
            content: "稳定升级 springboot版本为 2.3.3",
            timestamp: "2021-02-07",
          },
          {
            content: "优化登录验证码",
            timestamp: "2021-02-07",
          },
          {
            content: "新加入 redisson 分布式锁插件",
            timestamp: "2021-02-08",
          },
          {
            content: "软防火墙提取成starter插件",
            timestamp: "2021-02-09",
          },
          {
            content: "Maven结构调整",
            timestamp: "2021-02-10",
          },
          {
            content: "新增系统参数配置",
            timestamp: "2021-02-11",
          },
          {
            content: "优化唯一验证",
            timestamp: "2021-02-11",
          },
          {
            content: "优化接口加密模式，支持在线修改3种非对称加密",
            timestamp: "2021-02-13",
          },
          // =================================
          {
            content: "发布1.3.0版",
            timestamp: "2021-02-17",
          },
          {
            content: "删除无用代码",
            timestamp: "2021-02-18",
          },
          {
            content: "修复等待线程池无法释放BUG",
            timestamp: "2021-02-18",
          },
          {
            content: "修复参数缓存过滤器BUG",
            timestamp: "2021-02-19",
          },
          {
            content: "Excel导入导出性能大幅度优化",
            timestamp: "2021-02-23",
          },
          {
            content: "字典工具类优化",
            timestamp: "2021-02-23",
          },
          {
            content: "租户正在被其他用户绑定，禁止删除",
            timestamp: "2021-02-24",
          },
          {
            content: "代码生成器前端模板优化",
            timestamp: "2021-02-25",
          },
          {
            content: "优化组织机构操作限制",
            timestamp: "2021-02-25",
          },
          {
            content: "修复javassist 在某些jdk版本下 class地址不能很好获取BUG",
            timestamp: "2021-02-25",
          },
          {
            content: "优化转化工具类性能",
            timestamp: "2021-02-26",
          },
          {
            content: "超级管理员 角色-菜单-权限 逻辑调整",
            timestamp: "2021-02-27",
          },
          {
            content: "发布1.3.1 - Beta版",
            timestamp: "2021-03-01",
          },
          // =================================
          {
            content: "后端：优化条件构造器、分页类",
            timestamp: "2021-03-02",
          },
          {
            content: "后端：阻止用户组织Tree空间冒泡事件",
            timestamp: "2021-03-03",
          },
          {
            content: "后端：修复ThreadLocal 在Controller可能无法获得Token问题",
            timestamp: "2021-03-10",
          },
          {
            content: "后端：优化租户修改权限",
            timestamp: "2021-03-11",
          },
          {
            content: "后端：优化系统逻辑结构",
            timestamp: "2021-03-13",
          },
          {
            content: "后端：优化TokenAop拦截器",
            timestamp: "2021-03-15",
          },
          {
            content: "后端：修复手机号更改被清空问题",
            timestamp: "2021-04-02",
          },
          {
            content: "后端：优化字典类型",
            timestamp: "2021-04-02",
          },
          {
            content: "后端：新增租户启用接口，一键启用租户",
            timestamp: "2021-04-02",
          },
          {
            content: "后端：新增租户启用接口",
            timestamp: "2021-04-02",
          },
          {
            content: "后端：修复参数配置缓存 获得全部 可能数据丢失问题",
            timestamp: "2021-04-04",
          },
          {
            content: "后端：优化多线程锁等待执行器，消除线程死锁操作隐患",
            timestamp: "2021-04-08",
          },
          {
            content: "后端：新增树状结构工具类",
            timestamp: "2021-04-08",
          },

          {
            content: "后端：优化用户/租户逻辑",
            timestamp: "2021-04-09",
          },
          {
            content: "前端：优化个人中心相关显示，更改个人中心不受菜单控制",
            timestamp: "2021-04-09",
          },
          {
            content: "后端：菜单新增是否总是显示选项",
            timestamp: "2021-04-09",
          },
          {
            content: "前端：修复Tree控件 及联选择BUG",
            timestamp: "2021-04-10",
          },
          {
            content: "前端：修复头像更新异常问题",
            timestamp: "2021-04-19",
          },
          {
            content: "后端：优化菜单模块，菜单可选则上级",
            timestamp: "2021-04-21",
          },
          {
            content: "后端：新增登录Token续命模式",
            timestamp: "2021-04-26",
          },
          {
            content: "后端：优化系统健康模块",
            timestamp: "2021-04-28",
          },
          {
            content: "后端：新增参数配置模块",
            timestamp: "2021-04-29",
          },
          {
            content: "后端：新增SMTP邮件服务在线配置化",
            timestamp: "2021-04-29",
          },
          {
            content: "后端：优化文件上传功能，为后续OSS服务做足准备",
            timestamp: "2021-04-30",
          },
          {
            content: "后端：新增代码生成器反响生成菜单功能",
            timestamp: "2021-05-04",
          },
          {
            content: "后端：新增用户密码强度检测",
            timestamp: "2021-05-04",
          },
          {
            content: "前端：修复防抖处理无法正常使用问题",
            timestamp: "2021-05-04",
          },
          {
            content: "前端：dialog 弹出高斯模糊蒙层",
            timestamp: "2021-05-06",
          },
          {
            content: "后端：工具类增加初始化异常，防止在未初始化前使用",
            timestamp: "2021-05-07",
          },
          {
            content: "后端：规范化菜单路径",
            timestamp: "2021-05-08",
          },
          {
            content: "后端/前端：新增docker和docker-compose部署",
            timestamp: "2021-05-10",
          },
          {
            content: "后端：优化行锁错误提示",
            timestamp: "2021-05-11",
          },
          {
            content: "后端：修复前端编辑页面模版取消dialog框，刷新列表BUG",
            timestamp: "2021-05-11",
          },
          {
            content: "后端：优化 伪穿透过滤器，防止一次直接锁死，给予3次 穿透nil机会",
            timestamp: "2021-05-12",
          },
          {
            content: "后端(⭐⭐⭐️)：重构非对称加密工具类，抽象为非对称插件",
            timestamp: "2021-05-18",
          },
          {
            content: "后端：新增对称加密插件",
            timestamp: "2021-05-18",
          },
          {
            content: "前端(⭐⭐⭐️)：响应式UI兼容 手机、Pad、Pc端",
            timestamp: "2021-05-19",
          },
          {
            content: "前端：调整主题颜色",
            timestamp: "2021-05-20",
          },
          {
            content: "后端：优化登录鉴权验证",
            timestamp: "2021-05-21",
          },
          {
            content: "前端：优化 RSA加解密（支持长字符）",
            timestamp: "2021-05-21",
          },
          {
            content: "后端：优化Redis反序列化容错性",
            timestamp: "2021-05-25",
          },
          {
            content: "后端(⭐⭐⭐️)：重构代码生成器",
            timestamp: "2021-05-31",
          },
          {
            content: "后端：新增代码生成器模版",
            timestamp: "2021-05-31",
          },
          {
            content: "后端：新增又拍云存储服务",
            timestamp: "2021-06-03",
          },
          {
            content: "发布1.4.0 正式版",
            timestamp: "2021-06-03",
          },

          {
            content: "前端：修复头像可能存在跨域问题 无法显示",
            timestamp: "2021-06-04",
          },

          {
            content: "前端：修复Form表单验证无法通过bug",
            timestamp: "2021-06-09",
          },
          {
            content: "前端：修复TenantManagementEdit缺少isNull 验证",
            timestamp: "2021-06-18",
          },
          {
            content: "前端：修复退出后再次登录验证码失效问题",
            timestamp: "2021-06-22",
          },
          {
            content: "后端：修复菜单无法加载根节点问题",
            timestamp: "2021-06-25",
          },
          {
            content: "前端：修复本地存储回显问题",
            timestamp: "2021-07-30",
          },
          {
            content: "前端：修复TenantManagementEdit中“是否启用”的字段错误",
            timestamp: "2021-09-03",
          },
          {
            content: "前端：Element-ui 锁包, 打包异常",
            timestamp: "2021-09-08",
          },
          {
            content: "发布1.4.1 BUG修复版",
            timestamp: "2021-10-13",
          },
          {
            content: "优化组织机构",
            timestamp: "2021-10-16",
          },
          {
            content: "新增数据权限",
            timestamp: "2021-10-16",
          },
          {
            content: "发布1.5.0 正式版",
            timestamp: "2021-10-16",
          },
          {
            content: "后端：优化线程池处理工具",
            timestamp: "2021-11-03",
          },
          {
            content: "后端：修复租户管理员不能显示全部组织BUG",
            timestamp: "2021-11-17",
          },
          {
            content: "后端：修复数据权限死循环问题",
            timestamp: "2021-11-23",
          },
          {
            content: "后端：修复Redisson 解锁异常问题",
            timestamp: "2021-11-23",
          },
          {
            content: "后端：优化数据权限自身查询效率",
            timestamp: "2021-11-24",
          },
          {
            content: "新增菜单标签，可区分 系统菜单 和 功能菜单(针对租户)",
            timestamp: "2021-11-26",
          },
          {
            content: "系统用户可由超级管理员分配是否有切换租户的能力",
            timestamp: "2021-11-29",
          },
          {
            content: "新增API版本控制",
            timestamp: "2021-11-30",
          },
          {
            content: "修复组织机构 用户数据权限过滤不生效问题",
            timestamp: "2021-12-01",
          },
          {
            content: "前端：优化新增用户时，如果选中组织 则默认将用户绑定在该组织下",
            timestamp: "2021-12-01",
          },
          {
            content: "发布1.6.0 正式版",
            timestamp: "2021-12-01",
          },
          {
            content: "后端：修复 用户角色名称重复问题",
            timestamp: "2021-12-04",
          },
          {
            content: "后端：修复 树结构工具类BUG",
            timestamp: "2021-12-04",
          },
          {
            content: "后端：修复 组织超级管理员添加权限问题",
            timestamp: "2021-12-04",
          },
          {
            content: "后端：删除多余代码",
            timestamp: "2021-12-05",
          },
          {
            content: "后端：修复当前用户 组织为空或关联表CreateBy 报错问题",
            timestamp: "2021-12-05",
          },
          {
            content: "后端：修复设置用户组织时 每次会多出来一条垃圾数据问题",
            timestamp: "2021-12-05",
          },
          {
            content: "后端：修复超级管理员只能看自己数据BUG",
            timestamp: "2021-12-05",
          },
          {
            content: "前端：修复组织新增按钮不显示BUG",
            timestamp: "2021-12-05",
          },
          {
            content: "发布1.6.1 BUG修复版",
            timestamp: "2021-12-05",
          },
          {
            content: "后端：优化缓存存储机构（主要）",
            timestamp: "2021-12-10",
          },
          {
            content: "前/后端：优化头像上传",
            timestamp: "2021-12-11",
          },
          {
            content: "前/后端：优化登录加解密",
            timestamp: "2021-12-12",
          },
          {
            content: "前/后端：优化API 版本控制（调整回原来的api接口 /api/v1/xxxx）",
            timestamp: "2021-12-12",
          },
          {
            content: "发布1.6.2 系统优化版",
            timestamp: "2022-01-06",
          },
          {
            content: "后端：移除华为OBS log4j风险",
            timestamp: "2022-01-06",
          },
          {
            content: "后端：修复查询默认组织sql in 和 not in为空问题",
            timestamp: "2022-02-11",
          },
          {
            content: "后端：修复可能会导致分页异常的因素",
            timestamp: "2022-03-07",
          },
          {
            content: "后端：修复用户数据权限为全部数据，无组织无法查看数据问",
            timestamp: "2022-03-10",
          },
          {
            content: "后端：优化用户登录Token获取方式",
            timestamp: "2022-03-17",
          },
          {
            content: "前/后端：新增用户登录日志（租户数据隔离）",
            timestamp: "2022-03-18",
          },
          {
            content: "前/后端：新增用户登录日志（租户数据隔离）",
            timestamp: "2022-03-18",
          },
          {
            content: "后端：优化系统操作日志为租户数据隔离模式",
            timestamp: "2022-03-18",
          },
          {
            content: "后端：修复 系统用户 登录时无菜单陷入死循环问",
            timestamp: "2022-03-28",
          },
          {
            content: "后端：修复 登入日志/操作日志 组织机构为空 默认取 request token 的BUG",
            timestamp: "2022-03-29",
          },
          {
            content: "后端：修复 锁定账号 数据类型转化失败问题",
            timestamp: "2022-04-06",
          },
          {
            content: "后端：修复系统管理员无法 分配租户管理员问题",
            timestamp: "2022-04-19",
          },
          {
            content: "后端：OSS文件存储=>公用存储接口",
            timestamp: "2022-04-26",
          },
          {
            content: "前/后端：优化头像上传",
            timestamp: "2022-04-26",
          },
          {
            content: "发布1.6.3",
            timestamp: "2022-04-26",
          },
          {
            content: "前端：优化代码生成器下载代码模式",
            timestamp: "2022-04-30",
          },
          {
            content: "后端：修复菜单更换上级时，parent_ids 拼接错误问题",
            timestamp: "2022-04-30",
          },
          {
            content: "后端：修复代码生成器，生成代码时参数为空问题",
            timestamp: "2022-04-30",
          },
          {
            content: "前端：修复代码生成器 点击添加报错暂无数据问题",
            timestamp: "2022-04-30",
          },
          {
            content: "发布1.6.4 代码生成器修复版",
            timestamp: "2022-05-02",
          },
          {
            content: "后端：修复删除角色失败异常",
            timestamp: "2022-06-07",
          },
          {
            content: "后端：升级 fastjson 版本至 1.2.83 修复 CNVD-2022-40233",
            timestamp: "2022-06-17",
          },
          {
            content: "后端：修复部分权限不对问题",
            timestamp: "2022-06-17",
          },
          {
            content: "后端：强制设置代码生成器 为小写模式，保持与生成权限一致",
            timestamp: "2022-06-17",
          },
          {
            content: "后端：修复 SecurityCache 缓存穿透BUG",
            timestamp: "2022-07-24",
          },
          {
            content: "后端：SecurityCache 新增安全缓存 指定ttl获取缓存信息",
            timestamp: "2022-07-25",
          },
          {
            content: "后端：新增EventBus",
            timestamp: "2022-08-06",
          },
          {
            content: "新增 邮箱、手机、用户名 + 密码登陆",
            timestamp: "2022-08-06",
          },
          {
            content: "新增 邮箱 + 验证码 登录",
            timestamp: "2022-08-06",
          },
          {
            content: "新增 手机号 + 验证码 登录",
            timestamp: "2022-08-06",
          },
          {
            content: "新增 手机号 + 验证码 登录",
            timestamp: "2022-08-06",
          },
          {
            content: "新增个人修改手机号 前置身份校验",
            timestamp: "2022-08-06",
          },
          {
            content: "新增个人修改邮箱 前置身份校验",
            timestamp: "2022-08-06",
          },
          {
            content: "新增个人中心忘记密码 前置身份校验",
            timestamp: "2022-08-06",
          },
          {
            content: "后端：新增使用ResultWrapper 代替 ResultVo 返回数据",
            timestamp: "2022-08-06",
          },
          {
            content: "后端：优化接口加密",
            timestamp: "2022-08-06",
          },
          {
            content: "后端：优化CrudService实现",
            timestamp: "2022-08-06",
          },
          {
            content: "后端：变更自动日志记录模式到自定义记录",
            timestamp: "2022-08-06",
          },
          {
            content: "优化导出Excel模式为认证模",
            timestamp: "2022-08-06",
          },
          {
            content: "移除Shiro，变更使用SpringSecurity 作为权限验证",
            timestamp: "2022-08-06",
          },
          {
            content: "升级 mybatis-plus 版本至 3.5.2 修复若干CVE",
            timestamp: "2022-08-06",
          },
          {
            content: "升级 springboot 版本至 2.5.6 修复若干CVE",
            timestamp: "2022-08-06",
          },
          {
            content: "升级 mysql版本至8.0.28  修复 CVE-2022-21363",
            timestamp: "2022-08-06",
          },
          {
            content: "升级 guava 版本至 30.0.android 修复 修复 CVE-2020-8908",
            timestamp: "2022-08-06",
          },
          {
            content: "升级 bouncycastle 版本至 1.69 修复 Cxa9261daf-3755",
            timestamp: "2022-08-06",
          },
          {
            content: "升级 protobuf-java 版本至 3.18.2 修复 CVE-2021-22569",
            timestamp: "2022-08-06",
          },
          {
            content: "升级 logback 版本至 1.2.9 修复 CVE-2021-42550",
            timestamp: "2022-08-06",
          },
          {
            content: "前端：优化build老大难问题(image-webpack-loader 因国内网络问题无法下载)，现可配置选择是否压缩图片 ",
            timestamp: "2022-08-08",
          },
          {
            content: "发布2.0.0",
            timestamp: "2022-08-08",
          },
        ];
        data.map((item, index) => {
          if (index === data.length - 1) {
            item.color = "#0bbd87";
          }
        });
        this.activities = data;
        const res = [
          {
            title: "究竟是什么样的终点，才配得上这一路的颠沛流离。。。",
            closable: false,
            type: "success",
          },
          {
            title:
              "作者寄语：感谢Star，感恩相遇，愿世间美好与我们环环相扣，加油！屏幕前的我们，打破桎梏，坚守初心。其实人生改变命运的机会并没有太多，我们并不是不优秀，我们也并不是一无是处，我们也希望驻足山巅被众人仰望，也许我们缺少的只是一个机会，缺少的只是生命中的导师，我希望这个框架帮助到更多的人，希望有一天，我们面试的时候不再胆怯，希望有一天别人看到的不仅仅是你的努力，还有你的功成名就，出人头地。",
            closable: false,
            type: "warning",
          },
          {
            title:
              "鸣谢：jeeplus、element-ui、vue-admin-beautiful。",
            closable: false,
            type: "success",
          },
        ];
        this.noticeList = res;
        /* getRepos({
        token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
      }).then((res) => {
        const per_page = Math.ceil(res.data.stargazers_count / 100);
        alert(per_page);
        getStargazers({
          token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
          page: 1,
          per_page: res.per_page,
        }).then((res) => {
          alert(JSON.stringify(res));
        });
      }); */
      },
    },
  };
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    .table-title{
      padding: 10px;
      padding-left: 0;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 125px;
        }
      }
    }

    .card {
      min-height: 400px;

      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 100px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
