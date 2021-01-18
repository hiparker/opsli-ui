<template>
  <div v-loading="loadingData">
    <el-row :gutter="12">
      <el-col :xs="72" :sm="72" :md="36" :lg="36" :xl="24">
        <el-card
          shadow="hover"
          :body-style="{ padding: '0px' }"
          class="backColor"
        >
          <div slot="header">服务器信息</div>
          <el-row :gutter="12" class="col-font el-col whitebackColor">
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">服务器名称</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ systemInfo.computerName }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">操作系统</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ systemInfo.osName }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">服务器IP</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ systemInfo.computerIp }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">系统架构</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ systemInfo.osArch }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">CPU使用率（检测10秒）</div>
          <div>
            <vab-chart
              ref="myCircle"
              class="chart_box"
              theme="vab-echarts-theme"
              :options="chartCpu"
            />
          </div>
          <el-row :gutter="12" class="col-font el-col">
            <el-col :xs="18" :sm="18" :md="9" :lg="9" :xl="6">
              <div class="el-col_cell">CPU主频</div>
            </el-col>
            <el-col :xs="54" :sm="54" :md="27" :lg="27" :xl="18">
              <div class="el-col_cell">{{ cpuInfo.cpuName }}</div>
            </el-col>
            <el-col :xs="18" :sm="18" :md="9" :lg="9" :xl="6">
              <div class="el-col_cell">核心数</div>
            </el-col>
            <el-col :xs="54" :sm="54" :md="27" :lg="27" :xl="18">
              <div class="el-col_cell">{{ cpuInfo.cpuNum }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">内存使用率（检测10秒）</div>
          <vab-chart
            ref="myCircle"
            class="chart_box"
            theme="vab-echarts-theme"
            :options="chartMem"
          />
          <el-row :gutter="12" class="col-font el-col">
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">总内存</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">
                {{ memInfo.total }}G
              </div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">已用内存</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">
                {{ memInfo.used }}G
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">JVM使用率（检测10秒）</div>
          <vab-chart
            ref="myCircle"
            class="chart_box"
            theme="vab-echarts-theme"
            :options="chartJVM"
          />
          <el-row :gutter="12" class="col-font el-col whitebackColor">
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">JMV大小</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">
                {{ JVMInfo.total }}M
              </div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">已用JVM</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell" style="text-align: center">
                {{ JVMInfo.used }}M
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col el-col :xs="72" :sm="72" :md="36" :lg="36" :xl="24">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">JAVA虚拟机信息</div>
          <el-row :gutter="12" class="col-font el-col whitebackColor">
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">JAVA名称</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ JVMInfo.name }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">JAVA版本</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ JVMInfo.version }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">JAVA安装路径</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ JVMInfo.home }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">JDK启动时间</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ JVMInfo.startTime }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">JDK运行时间</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ JVMInfo.runTime }}</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">JVM最大可用内存</div>
            </el-col>
            <el-col :xs="36" :sm="36" :md="18" :lg="18" :xl="12">
              <div class="el-col_cell">{{ JVMInfo.total }}M</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col el-col :xs="72" :sm="72" :md="36" :lg="36" :xl="24">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div slot="header">磁盘信息</div>
          <el-table
            v-loading="listLoading"
            :data="SysFilesInfoTableData"
            style="width: 100%"
          >
            <el-table-column
              prop="dirName"
              label="盘符路径"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="typeName"
              label="文件系统"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="sysTypeName"
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
                  <el-progress :percentage="scope.row.usage"></el-progress>
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
  } from "@/api/monitorManagement";
  import { isNull } from "@/utils/validate";

  export default {
    name: "MonitorManagement",
    components: {
      VabChart,
    },
    data() {
      return {
        listLoading: true,
        loadingData: true,
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
        },
        cpuInfo: {
          cpuName: "",
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
          name: "",
          total: 0,
          max: 0,
          free: 0,
          version: "",
          home: "",
          used: "",
          usage: "",
          startTime: "",
          runTime: "",
        },
        SysFilesInfoTableData: [],
      };
    },
    created() {
      this.timer = setInterval(() => {
        this.cpuData();
        this.memData();
        this.JVMData();
      }, 10000);
    },
    destroyed() {
      clearInterval(this.timer);
    },
    mounted() {
      this.$nextTick(this.fetchData());
    },
    methods: {
      async fetchData() {
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
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
        }
        this.listLoading = true;
        this.loadingData = false;
      },
      async cpuData() {
        const { data } = await getCpuInfo(this.queryForm);
        if (!isNull(data)) {
          this.cpuInfo = data;
          this.chartCpu.series[0].data[0].value = data.used;
        }
        //console.log("cpu"+this.cpuInfo);
      },
      async memData() {
        const { data } = await getMemInfo(this.queryForm);
        if (!isNull(data)) {
          this.memInfo = data;
          this.chartMem.series[0].data[0].value = data.usage;
        }
        //console.log("mem"+this.memInfo);
      },
      async JVMData() {
        const { data } = await getJVMInfo(this.queryForm);
        if (!isNull(data)) {
          this.JVMInfo = data;
          this.chartJVM.series[0].data[0].value = data.usage;
        }
        //console.log("jvm"+this.JVMInfo);
      },
    },
  };
</script>

<style scoped>
  .chart_box {
    width: 100%;
  }
  .backColor {
    background-color: #ffba00;
  }
  .whitebackColor {
    background-color: white;
  }
  .el-col {
    position: relative;
    box-sizing: border-box;
    padding: 7.5px 0;
  }
  .col-font {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  .el-col_cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
