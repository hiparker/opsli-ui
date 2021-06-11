<template>
  <div class="tenantManagement-container">
    <el-collapse-transition>
      <div v-show="this.moreQueryFlag" class="more-query">
        <!-- 更多查找 -->
        <vab-query-form>
          <vab-query-form-left-panel :span="24">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.carBrand_LIKE"
                  placeholder="请输入汽车品牌"
                  clearable
                />
              </el-form-item>

              <el-form-item>
                <el-date-picker
                  v-model="produceDataDatePicker"
                  type="daterange"
                  align="right"
                  range-separator="至"
                  start-placeholder="开始生产日期"
                  end-placeholder="结束生产日期"
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
          v-if="$perms('gentest_carinfo_insert')"
          icon="el-icon-plus"
          type="primary"
          @click="handleInsert"
        >
          添加
        </el-button>

        <el-button
          v-if="$perms('gentest_carinfo_import')"
          icon="el-icon-upload2"
          type="warning"
          @click="handleImportExcel"
        >
          导入
        </el-button>

        <el-button
          v-if="$perms('gentest_carinfo_export')"
          icon="el-icon-download"
          type="warning"
          @click="handleExportExcel"
        >
          导出
        </el-button>

        <el-button
          v-if="$perms('gentest_carinfo_delete')"
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
              v-model.trim="queryForm.carName_EQ"
              placeholder="请输入汽车名称"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model.trim="queryForm.carType_LIKE"
              placeholder="请输入汽车类型"
              clearable
            />
          </el-form-item>

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
        prop="carName"
        label="汽车名称"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="carType"
        label="汽车类型"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="carBrand"
        label="汽车品牌"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="produceData"
        label="生产日期"
      ></el-table-column>

      <el-table-column show-overflow-tooltip prop="izUsable" label="是否启用">
        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue("no_yes", scope.row.izUsable) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="
          $perms('gentest_carinfo_update') || $perms('gentest_carinfo_delete')
        "
        fixed="right"
        show-overflow-tooltip
        label="操作"
        width="130"
      >
        <template v-slot="scope">
          <el-button
            v-if="$perms('gentest_carinfo_update')"
            type="text"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>

          <el-divider direction="vertical"></el-divider>

          <el-button
            v-if="$perms('gentest_carinfo_delete')"
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
  } from "@/api/gentest/carinfo/TestCarManagement";
  import Edit from "./components/TestCarManagementEdit";
  import Import from "./components/TestCarManagementImport";

  import { vueButtonClickBan } from "@/utils";
  import { isNotNull } from "@/utils/valiargs";
  import { formateDate } from "@/utils/format";

  export default {
    name: "TestCarManagement",
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
          carName_EQ: "",
          carType_LIKE: "",
          carBrand_LIKE: "",
          produceData_BEGIN: "",
          produceData_END: "",
          izUsable_EQ: "",
        },
        produceDataDatePicker: [],
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
          isNotNull(this.produceDataDatePicker) &&
          this.produceDataDatePicker.length === 2
        ) {
          this.queryForm.produceData_BEGIN =
            this.produceDataDatePicker.length === 0
              ? ""
              : formateDate(
                  this.produceDataDatePicker[0],
                  "yyyy-MM-dd hh:mm:ss"
                );
          this.queryForm.produceData_END =
            this.produceDataDatePicker.length === 0
              ? ""
              : formateDate(
                  this.produceDataDatePicker[1],
                  "yyyy-MM-dd hh:mm:ss"
                );
        } else {
          this.queryForm.produceData_BEGIN = "";
          this.queryForm.produceData_END = "";
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
