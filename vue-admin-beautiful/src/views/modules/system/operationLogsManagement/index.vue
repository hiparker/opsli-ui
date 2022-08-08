<template>
  <div class="logsManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>

          <el-form-item>
            <el-select
              v-model="queryForm.logType_EQ"
              placeholder="日志类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in $getDictList('log_type')"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="queryForm.level_EQ"
              placeholder="日志等级"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in $getDictList('log_level')"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="queryForm.operationType_EQ"
              placeholder="操作类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in $getDictList('log_operation_type')"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="queryForm.moduleId_EQ"
              placeholder="操作模块"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in $getDictList('log_model_type')"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>



          <el-form-item>
            <el-input
              v-model.trim="queryForm.username_EQ"
              placeholder="请输入操作人账号"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="datePicker"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>


    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column show-overflow-tooltip label="序号" width="95">
        <template slot-scope="scope">
          {{(queryForm.pageNo - 1) * queryForm.pageSize + scope.$index + 1}}
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="logType"
        label="日志类型"
        width="100"
      >

        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue('log_type', scope.row.logType) }}
          </span>
        </template>

      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="level"
        label="日志等级"
        width="100"
      >

        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue('log_level', scope.row.level) }}
          </span>
        </template>

      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="moduleId"
        label="被操作的系统模块"
        width="140"
      >

        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue('log_model_type', scope.row.moduleId) }}
          </span>
        </template>

      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="username"
        label="操作人账号"
        width="110"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="realName"
        label="操作人名称"
        width="110"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="operationType"
        label="操作类型"
        width="100"
      >
        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue('log_operation_type', scope.row.operationType) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="runTime"
        label="运行时间(ms)"
        width="110"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="description"
        label="日志描述"
      ></el-table-column>


      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="110"
      >
        <template v-slot="scope">
          <el-button
            type="text"
            @click="detail(scope.row)"
          > 详情 </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <operation-detail ref="OperationDetail"></operation-detail>

  </div>
</template>

<script>
import { getList } from "@/api/system/logs/OperationLogManagementApi";
import { isNull } from "@/utils/validate";
import { formateDate } from "@/utils/format";
import OperationDetail from "./components/OperationDetail";


export default {
  name: "OpLoginLogsManagement",
  components: { OperationDetail },
  data() {
    return {
      list: null,
      listLoading: true,
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      selectRows: "",
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username_EQ: "",
        realName_LIKE: "",
        logType_EQ: "",
        level_EQ: "",
        operationType_EQ: "",
        moduleId_EQ: "",
        createTime_BEGIN: "",
        createTime_END: "",
      },
      datePicker: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    detail(row){
      console.log(row)
      if (row.id) {
        this.$refs["OperationDetail"].show(row);
      }
    },
    setSelectRows(val) {
      this.selectRows = val;
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val;
      this.fetchData();
    },
    queryData() {
      if(!isNull(this.datePicker) && this.datePicker.length === 2){
        this.queryForm.createTime_BEGIN =
          this.datePicker.length === 0 ? "" : formateDate(this.datePicker[0], 'yyyy-MM-dd hh:mm:ss');
        this.queryForm.createTime_END =
          this.datePicker.length === 0 ? "" : formateDate(this.datePicker[1], 'yyyy-MM-dd hh:mm:ss');
      }else{
        this.queryForm.createTime_BEGIN = "";
        this.queryForm.createTime_END = "";
      }
      this.queryForm.pageNo = 1;
      this.fetchData();
    },
    async fetchData() {
      this.listLoading = true;
      const { data } = await getList(this.queryForm);
      if(!isNull(data)){
        this.list = data.rows;
        this.total = data.total;
      }

      setTimeout(() => {
        this.listLoading = false;
      }, 300);
    },
  },
};
</script>
