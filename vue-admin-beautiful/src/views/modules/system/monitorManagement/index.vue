<template>
  <div class="card-container monitor-ui" v-loading="loadingData">

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">CPU使用率（检测{{speed}}秒）</div>
          <div>
            <vab-chart
              ref="myCircle"
              class="chart-box"
              theme="vab-echarts-theme"
              :options="chartCpu"
            />
          </div>
          <el-form class="orgManagement-edit-container" label-width="115px">
            <el-row>
              <el-col>
                <el-form-item label="CPU主频" >
                  <el-tooltip :content="cpuInfo.cpuModel" placement="top">
                    <div class="grid-content" title="">
                      {{ cpuInfo.cpuModel}}
                    </div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="核心数">
                  {{ cpuInfo.cpuNum }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">内存使用率（检测{{speed}}秒）</div>
          <vab-chart
            ref="myCircle"
            class="chart-box"
            theme="vab-echarts-theme"
            :options="chartMem"
          />
          <el-form class="orgManagement-edit-container" label-width="115px">
            <el-row>
              <el-col>
                <el-form-item label="总内存">
                  {{ memInfo.total }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="已用内存">
                  {{ memInfo.used }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">JVM使用率（检测{{speed}}秒）</div>
          <vab-chart
            ref="myCircle"
            class="chart-box"
            theme="vab-echarts-theme"
            :options="chartJVM"
          />
          <el-form class="orgManagement-edit-container" label-width="115px">
            <el-row>
              <el-col>
                <el-form-item label="JMV大小">
                  {{ JVMInfo.total}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="已用JVM">
                  {{ JVMInfo.used }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col>
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">服务器信息</div>
          <el-form class="orgManagement-edit-container" label-width="115px">
            <el-row :gutter="10" >
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="服务器名称">
                  {{ systemInfo.computerName }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="操作系统">
                  {{ systemInfo.osName }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="服务器IP">
                  {{ systemInfo.computerIp }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="系统架构">
                  {{ systemInfo.osArch }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="操作用户">
                  {{ systemInfo.userName }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="项目路径">
                  {{ systemInfo.userDir }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

      <el-col>
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">JAVA虚拟机信息</div>
          <el-form class="orgManagement-edit-container" label-width="115px">
            <el-row :gutter="10" >
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="JVM名称">
                  {{ JVMInfo.jvmName }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="JAVA版本">
                  {{ JVMInfo.version }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="JAVA供应商">
                  {{ JVMInfo.vendor }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="JAVA供应商URL">
                  {{ JVMInfo.vendorUrl }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="JDK启动时间">
                  {{ JVMInfo.startTime }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="JDK运行时间">
                  {{ JVMInfo.runTime }}
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                  <el-form-item label="JAVA安装路径">
                    {{ JVMInfo.home }}
                  </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="72" :sm="72" :md="36" :lg="36" :xl="24">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">磁盘信息</div>
          <el-table
            v-loading="listLoading"
            :data="SysFilesInfoTableData"
            style="width: 100%"
          >
            <el-table-column
              prop="diskName"
              label="盘符路径"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="fileName"
              label="文件系统"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="diskType"
              label="盘符类型"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="total"
              label="总大小"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="free"
              label="可用大小"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="used"
              label="已用大小"
              align="left"
            ></el-table-column>
            <el-table-column prop="usage" label="已用百分比" align="left">
              <template slot-scope="scope">
                <span>
                  <el-progress
                    :text-inside="true" :stroke-width="26"
                    :percentage="scope.row.usage"
                    :color="customColors"
                  ></el-progress>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VabChart from "@/plugins/echarts";
  import {
    getCpuInfo,
    getJVMInfo,
    getMemInfo,
    getSystemInfo,
  } from "@/api/system/monitor/monitorManagement";
  import { isNull } from "@/utils/validate";

  export default {
    name: "MonitorManagement",
    components: {
      VabChart,
    },
    data() {
      return {
        customColors: [
          {color: '#5cb87a', percentage: 20},
          {color: '#1989fa', percentage: 40},
          {color: '#6f7ad3', percentage: 60},
          {color: '#e6a23c', percentage: 80},
          {color: '#f56c6c', percentage: 100},
        ],

        listLoading: true,
        loadingData: true,
        // 刷新速度
        speed: 5,
        chartCpu: {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%",
          },
          series: [
            {
              name: "CPU使用率",
              type: "gauge",
              detail: { formatter: "{value}%" },
              data: [{ value: 0, name: "CPU使用率" }],
            },
          ],
        },
        chartMem: {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%",
          },
          series: [
            {
              name: "内存使用率",
              type: "gauge",
              detail: { formatter: "{value}%" },
              data: [{ value: 0, name: "内存使用率" }],
            },
          ],
        },
        chartJVM: {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%",
          },
          series: [
            {
              name: "JVM使用率",
              type: "gauge",
              detail: { formatter: "{value}%" },
              data: [{ value: 0, name: "JVM使用率" }],
            },
          ],
        },
        systemInfo: {
          computerName: "",
          computerIp: "",
          osName: "",
          osArch: "",
          userName: "",
          userDir: ""
        },
        cpuInfo: {
          cpuModel: "",
          cpuNum: 0,
          total: 0,
          sys: 0,
          used: 0,
          wait: 0,
          free: 0,
        },
        memInfo: {
          total: 0,
          used: 0,
          free: 0,
        },
        JVMInfo: {
          jvmName: "",
          total: 0,
          max: 0,
          free: 0,
          version: "",
          home: "",
          used: "",
          usage: "",
          startTime: "",
          runTime: "",
          vendor: "",
          vendorUrl: "",
        },
        SysFilesInfoTableData: [],
      };
    },
    created() {
      // 默认 5秒 刷一次
      this.timer = setInterval(() => {
        this.cpuData();
        this.memData();
        this.JVMData();
      }, this.$options.data().speed * 1000);
    },
    destroyed() {
      clearInterval(this.timer);
    },
    mounted() {
      // 加载数据
      this.fetchData();
    },
    filters: {
      ellipsis(value) {
        if (!value) return "";
        if (value.length > 30) {
          return value.slice(0, 30) + "...";
        }
        return value;
      }
    },
    methods: {
      async fetchData() {
        this.listLoading = true;

        const { data } = await getSystemInfo(this.queryForm);
        if (!isNull(data)) {
          this.cpuInfo = data.cpuInfo;
          this.systemInfo = data.systemInfo;
          this.memInfo = data.memInfo;
          this.JVMInfo = data.JVMInfo;
          this.chartCpu.series[0].data[0].value = data.cpuInfo.used;
          this.chartMem.series[0].data[0].value = data.memInfo.usage;
          this.chartJVM.series[0].data[0].value = data.JVMInfo.usage;
          this.SysFilesInfoTableData = data.sysFileInfo;
        }

        setTimeout(() => {
          this.listLoading = false;
          this.loadingData = false;
        }, 150);
      },
      async cpuData() {
        const { data } = await getCpuInfo(this.queryForm);
        if (!isNull(data)) {
          this.cpuInfo = data;
          this.chartCpu.series[0].data[0].value = data.used;
        }
      },
      async memData() {
        const { data } = await getMemInfo(this.queryForm);
        if (!isNull(data)) {
          this.memInfo = data;
          this.chartMem.series[0].data[0].value = data.usage;
        }
      },
      async JVMData() {
        const { data } = await getJVMInfo(this.queryForm);
        if (!isNull(data)) {
          this.JVMInfo = data;
          this.chartJVM.series[0].data[0].value = data.usage;
        }
      },
    },
  };
</script>

<style scoped>
  .monitor-ui .grid-content{
    width: 95%;    /*根据自己项目进行定义宽度*/
    overflow: hidden;     /*设置超出的部分进行影藏*/
    text-overflow: ellipsis;     /*设置超出部分使用省略号*/
    white-space:nowrap ;    /*设置为单行*/
  }
  .chart-box {
    width: 100%;
  }
</style>
