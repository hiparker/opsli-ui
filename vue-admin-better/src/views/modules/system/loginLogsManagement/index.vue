<template>
  <div class="logsManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="6">
        <el-radio-group v-model="queryForm.type_EQ" size="small" @change="fetchData">
          <el-radio-button label="1">登入</el-radio-button>
          <el-radio-button label="2">登出</el-radio-button>
        </el-radio-group>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="18">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>

          <el-form-item>
            <el-input
              v-model.trim="queryForm.username_EQ"
              placeholder="请输入用户名"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model.trim="queryForm.realName_LIKE"
              placeholder="请输入用户昵称"
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
      </vab-query-form-right-panel>
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
        prop="username"
        label="用户名"
        width="120"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="realName"
        label="用户姓名"
        width="180"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="remoteAddr"
        label="用户IP"
        width="150"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="loginFrom"
        label="登陆来源"
        width="120"
      >
        <template slot-scope="scope">
              <span>
                {{ $getDictNameByValue('login_from', scope.row.loginFrom) }}
              </span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="userAgent"
        label="用户代理"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        label="创建时间"
        width="180"
      ></el-table-column>

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

  </div>
</template>

<script>
import { getList } from "@/api/system/logs/loginLogsManagement";
import { isNull } from "@/utils/validate";
import { formateDate } from "@/utils/format";

export default {
  name: "LogsManagement",
  components: { },
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
        type_EQ: "1",
        username_EQ: "",
        realName_LIKE: "",
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
