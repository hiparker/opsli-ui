<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :modal="false"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    top="7vh"
    width="850px"
    center
    @close="close"
  >
    <div class="adaptive-container">
      <div class="tenantManagement-container">
        <vab-query-form>
          <vab-query-form-left-panel :span="24">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.id_EQ"
                  placeholder="请输入租户ID"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.tenantName_LIKE"
                  placeholder="请输入租户名称"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="queryData"
                >
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
          highlight-current-row
          @current-change="setCurrent"
        >
          <el-table-column show-overflow-tooltip label="序号" width="95">
            <template slot-scope="scope">
              {{
                (queryForm.pageNo - 1) * queryForm.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="租户ID"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="tenantName"
            label="租户名称"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="remark"
            label="备注"
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
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getList } from "@/api/system/tenant/tenantManagement";
  import { isNull } from "@/utils/validate";

  export default {
    name: "TenantManagement",
    components: {},
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
          izUsable_EQ: "1",
          tenantName_LIKE: "",
        },
        currentRow: null,
        title: "租户选择",
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      show() {
        this.fetchData();
        this.dialogFormVisible = true;
      },
      close() {
        this.queryForm = {
          pageNo: 1,
          pageSize: 10,
          title: "",
          izUsable_EQ: "1",
          tenantName_LIKE: "",
        };
        this.currentRow = null;
        this.dialogFormVisible = false;
      },
      save() {
        if (isNull(this.currentRow)) {
          this.$baseMessage("请选择租户", "warning");
          return;
        }
        this.$emit("tenant", this.currentRow);
        this.close();
      },
      setCurrent(val) {
        this.currentRow = val;
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
        this.queryForm.pageNo = 1;
        this.fetchData();
      },
      async fetchData() {
        this.listLoading = true;
        const { data } = await getList(this.queryForm);
        if (!isNull(data)) {
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
