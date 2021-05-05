<template>
  <div class="logsManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="6">

        <el-button
          v-if="$perms('devops_logs_delete')"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
        > 清空一个月前日志 </el-button>

      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="18">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>

          <el-form-item>
            <el-select v-model="queryForm.type_EQ" placeholder="请选择日志类型" style="width: 100%">
              <el-option
                v-for="item in logType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
        prop="title"
        label="日志标题"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="type"
        label="日志类型"
        width="100"
      >
        <template slot-scope="scope">
              <span>
                <el-tag v-if="scope.row.type === '1' " type="primary">接入日志</el-tag>
                <el-tag v-if="scope.row.type === '2' " type="danger">错误日志</el-tag>
              </span>
        </template>
      </el-table-column>


      <el-table-column
        show-overflow-tooltip
        prop="requestUri"
        label="操作URI"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="method"
        label="操作方式"
        width="100"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="remoteAddr"
        label="用户IP"
        width="120"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="userAgent"
        label="用户代理"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="params"
        label="请求参数"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="exception"
        label="异常信息"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="timeout"
        label="执行时间(ms)"
        width="160"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        label="创建时间"
        width="160"
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
  import { getList, doDelete } from "@/api/logsManagement";
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
          type_EQ: "",
          createTime_BEGIN: "",
          createTime_END: "",
        },
        logType: [
          {
            value: "1",
            label: "接入日志 ",
          },
          {
            value: "2",
            label: "错误日志 ",
          },
        ],
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
      handleDelete(row) {
        // if (row.id) {
        //   this.$baseConfirm("你确定要删除当前项吗", null, async () => {
        //     const { msg } = await doDelete({ id: row.id });
        //     this.$baseMessage(msg, "success");
        //     await this.fetchData();
        //   });
        // } else {
        //   if (this.selectRows.length > 0) {
        //     const ids = this.selectRows.map((item) => item.id).join();
        //     this.$baseConfirm("你确定要删除选中项吗", null, async () => {
        //       const { msg } = await doDeleteAll({ ids });
        //       this.$baseMessage(msg, "success");
        //       await this.fetchData();
        //     });
        //   } else {
        //     this.$baseMessage("未选中任何行", "error");
        //     return false;
        //   }
        // }

        this.$baseConfirm("你确定要清空一个月之前的日志吗", null, async () => {
          const { msg } = await doDelete();
          this.$baseMessage(msg, "success");
          await this.fetchData();
        });
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
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
        }
      },
    },
  };
</script>
