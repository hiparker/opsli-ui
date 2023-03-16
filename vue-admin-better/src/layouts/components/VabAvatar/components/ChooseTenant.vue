<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    append-to-body
    width="800px"
    @close="close"
  >
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
      highlight-current-row
      :element-loading-text="elementLoadingText"
      @current-change="setSelectRow"
    >
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

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="choose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import store from "@/store";
  import { getList } from "@/api/system/tenant/tenantManagement";
  import {
    switchTenant,
    switchOneself,
  } from "@/api/system/user/userManagement";

  export default {
    name: "ChooseTenant",
    data() {
      return {
        list: null,
        listLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        selectRow: {},
        selectRows: [],
        elementLoadingText: "正在加载...",
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          id_EQ: "",
          enable_EQ: "1",
          tenantName_LIKE: "",
        },
        title: "选择租户",
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      show(switchTenantId) {
        const that = this;

        if (!switchTenantId) {
          this.dialogFormVisible = true;
          this.fetchData();
          return;
        }

        // 已切换租户 走这里
        this.$baseConfirm("你确定要恢复系统管理", null, async () => {
          const { msg } = await switchOneself();
          // 刷新当前用户信息
          const flag = await store.dispatch("user/refreshUserPerms");
          this.$baseMessage(msg, "success");
          that.close();
          location.reload();
        });
      },
      close() {
        this.dialogFormVisible = false;
        this.list = null;
        this.queryForm = this.$options.data().queryForm;
      },
      // 选择
      choose() {
        const that = this;

        this.$baseConfirm(
          "你确定要切换至[" + this.selectRow.tenantName + "]吗？",
          null,
          async () => {
            const { msg } = await switchTenant({
              tenantId: this.selectRow.id,
            });
            // 刷新当前用户信息
            await store.dispatch("user/refreshUserPerms");
            this.$baseMessage(msg, "success");
            that.close();
            location.reload();
          }
        );
      },
      setSelectRow(val) {
        this.selectRow = val;
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
        this.queryForm.pageNo = 1;
        this.fetchData();
      },
      async fetchData() {
        this.listLoading = true;
        const { data } = await getList(this.queryForm);
        if (null !== data && undefined !== data) {
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
