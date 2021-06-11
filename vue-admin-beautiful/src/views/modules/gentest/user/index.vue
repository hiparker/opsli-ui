<template>
  <div class="tenantManagement-container">
    <el-collapse-transition>
      <div v-show="this.moreQueryFlag" class="more-query">
        <!-- 更多查找 -->
        <vab-query-form>
          <vab-query-form-left-panel :span="24">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>
              <el-form-item>
                <el-date-picker
                  v-model="birthDatePicker"
                  type="daterange"
                  align="right"
                  range-separator="至"
                  start-placeholder="开始生日"
                  end-placeholder="结束生日"
                ></el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-select
                  v-model="queryForm.izUsable_EQ"
                  placeholder="请选择是否启用"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in dict.no_yes"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-divider></el-divider>
      </div>
    </el-collapse-transition>

    <!-- 主要操作  -->
    <vab-query-form>
      <vab-query-form-left-panel :span="10">
        <el-button
          v-if="$perms('gentest_user_insert')"
          icon="el-icon-plus"
          type="primary"
          @click="handleInsert"
        >
          添加
        </el-button>

        <el-button
          v-if="$perms('gentest_user_import')"
          icon="el-icon-upload2"
          type="warning"
          @click="handleImportExcel"
        >
          导入
        </el-button>

        <el-button
          v-if="$perms('gentest_user_export')"
          icon="el-icon-download"
          type="warning"
          @click="handleExportExcel"
        >
          导出
        </el-button>

        <el-button
          v-if="$perms('gentest_user_delete')"
          :disabled="!selectRows.length > 0"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
        >
          批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.name_LIKE"
              placeholder="请输入名称"
              clearable
            />
          </el-form-item>

          <el-col :span="12">
            <el-form-item style="text-align: center">
              <el-input
                v-model.trim="queryForm.money_BEGIN"
                placeholder="金钱开始"
                clearable
                style="float: left; width: calc(50% - 6px)"
              />
              <div style="float: left; width: 12px">-</div>
              <el-input
                v-model.trim="queryForm.money_END"
                placeholder="金钱结束"
                clearable
                style="float: right; width: calc(50% - 6px)"
              />
            </el-form-item>
          </el-col>

          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>

            <el-button icon="el-icon-search" @click="moreQuery">更多</el-button>
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
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>

      <el-table-column show-overflow-tooltip label="序号" width="95">
        <template slot-scope="scope">
          {{ (queryForm.pageNo - 1) * queryForm.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="名称"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="money"
        label="金钱"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="age"
        label="年龄"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="birth"
        label="生日"
      ></el-table-column>

      <el-table-column show-overflow-tooltip prop="izUsable" label="是否启用">
        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue("no_yes", scope.row.izUsable) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="$perms('gentest_user_update') || $perms('gentest_user_delete')"
        show-overflow-tooltip
        label="操作"
        width="130"
        fixed="right"
      >
        <template v-slot="scope">
          <el-button
            v-if="$perms('gentest_user_update')"
            type="text"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>

          <el-divider direction="vertical"></el-divider>

          <el-button
            v-if="$perms('gentest_user_delete')"
            type="text"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
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

    <edit ref="edit" @fetchData="fetchData"></edit>
    <import ref="import" @fetchData="fetchData"></import>
  </div>
</template>

<script>
  import {
    getList,
    doDelete,
    doDeleteAll,
    doExportExcel,
  } from "@/api/gentest/user/TestUserManagement";
  import Edit from "./components/TestUserManagementEdit";
  import Import from "./components/TestUserManagementImport";

  import { vueButtonClickBan } from "@/utils";
  import { isNotNull } from "@/utils/valiargs";
  import { formateDate } from "@/utils/format";

  export default {
    name: "TestUserManagement",
    components: { Edit, Import },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        selectRows: "",
        elementLoadingText: "正在加载...",
        moreQueryFlag: false,
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          name_LIKE: "",
          money_BEGIN: "",
          money_END: "",
          birth_BEGIN: "",
          birth_END: "",
          izUsable_EQ: "",
        },
        birthDatePicker: [],
        dict: {},
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              },
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              },
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              },
            },
          ],
        },
      };
    },
    created() {
      this.fetchData();
    },
    mounted() {
      this.dict.no_yes = this.$getDictList("no_yes");
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val;
      },
      handleInsert(row) {
        this.$refs["edit"].showEdit();
      },
      handleUpdate(row) {
        if (row.id) {
          this.$refs["edit"].showEdit(row);
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm("你确定要删除当前项吗", null, async () => {
            const { msg } = await doDelete({ id: row.id });
            this.$baseMessage(msg, "success");
            await this.fetchData();
          });
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join();
            this.$baseConfirm("你确定要删除选中项吗", null, async () => {
              const { msg } = await doDeleteAll({ ids });
              this.$baseMessage(msg, "success");
              await this.fetchData();
            });
          } else {
            this.$baseMessage("未选中任何行", "error");
            return false;
          }
        }
      },
      // 导出excel
      handleExportExcel(el) {
        if (
          isNotNull(this.birthDatePicker) &&
          this.birthDatePicker.length === 2
        ) {
          this.queryForm.birth_BEGIN =
            this.birthDatePicker.length === 0
              ? ""
              : formateDate(this.birthDatePicker[0], "yyyy-MM-dd hh:mm:ss");
          this.queryForm.birth_END =
            this.birthDatePicker.length === 0
              ? ""
              : formateDate(this.birthDatePicker[1], "yyyy-MM-dd hh:mm:ss");
        } else {
          this.queryForm.birth_BEGIN = "";
          this.queryForm.birth_END = "";
        }

        // 导出按钮防抖处理 默认限制为10秒
        vueButtonClickBan(el, 10);

        // 执行导出
        doExportExcel(this.queryForm);
      },
      // 导入excel
      handleImportExcel() {
        this.$refs["import"].show();
      },

      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.fetchData();
      },
      moreQuery() {
        this.moreQueryFlag = !this.moreQueryFlag;
      },
      queryData() {
        if (
          isNotNull(this.birthDatePicker) &&
          this.birthDatePicker.length === 2
        ) {
          this.queryForm.birth_BEGIN =
            this.birthDatePicker.length === 0
              ? ""
              : formateDate(this.birthDatePicker[0], "yyyy-MM-dd hh:mm:ss");
          this.queryForm.birth_END =
            this.birthDatePicker.length === 0
              ? ""
              : formateDate(this.birthDatePicker[1], "yyyy-MM-dd hh:mm:ss");
        } else {
          this.queryForm.birth_BEGIN = "";
          this.queryForm.birth_END = "";
        }

        this.queryForm.pageNo = 1;
        this.fetchData();
      },

      async fetchData() {
        this.listLoading = true;
        const { data } = await getList(this.queryForm);
        if (isNotNull(data)) {
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
