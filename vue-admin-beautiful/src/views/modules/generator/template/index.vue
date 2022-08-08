<template>
  <div class="tenantManagement-container">

    <el-collapse-transition>
    <div class="more-query" v-show="this.moreQueryFlag">
      <!-- 更多查找 -->
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" :model="queryForm" @submit.native.prevent>

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
            v-if="$perms('generator_template_insert')"
            icon="el-icon-plus"
            type="primary"
            @click="handleInsert"
        > 添加 </el-button>

        <el-button
          v-if="$perms('generator_template_copy')"
          :disabled="selectRows.length !== 1"
          icon="el-icon-download"
          type="warning"
          @click="handleCopy"
        >
          复制
        </el-button>

      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>

          <el-form-item>
            <el-input
                    v-model.trim="queryForm.tempName_LIKE"
                    placeholder="请输入模板名称"
                    clearable
            />
          </el-form-item>

          <el-form-item>
            <el-select v-model="queryForm.tableType_EQ" placeholder="请选择表类型" clearable style="width: 100%">
              <el-option
                      v-for="item in dict.table_type"
                      :key="item.dictValue"
                      :label="item.dictName"
                      :value="item.dictValue"
              ></el-option>
            </el-select>
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
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>

      <el-table-column show-overflow-tooltip label="序号" width="95">
        <template slot-scope="scope">
          {{(queryForm.pageNo - 1) * queryForm.pageSize + scope.$index + 1}}
        </template>
      </el-table-column>

      <el-table-column
              show-overflow-tooltip
              prop="tempName"
              label="模板名称"
      ></el-table-column>

      <el-table-column
              show-overflow-tooltip
              prop="tableType"
              label="表类型"
      >

        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue('table_type', scope.row.tableType) }}
          </span>
        </template>

      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="remark"
        label="备注"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="130"
        v-if="$perms('generator_template_update') || $perms('generator_template_delete')"
      >
        <template v-slot="scope">
          <el-button
            v-if="$perms('generator_template_update')"
            type="text"
            @click="handleUpdate(scope.row)"
          > 编辑 </el-button>

          <el-divider direction="vertical"></el-divider>

          <el-button
            v-if="$perms('generator_template_delete')"
            type="text"
            @click="handleDelete(scope.row)"
          > 删除 </el-button>
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

  </div>
</template>

<script>

import {getList, doDelete, doDeleteAll, doCopy, doUpdate} from "@/api/generator/template/GenTemplateManagement";

  import Edit from "./components/GenTemplateManagementEdit";
  import { isNotNull } from "@/utils/valiargs";
  import {
    isGeneralWithChinese,
  } from "@/utils/valiargs";

  export default {
    name: "GenTemplateManagement",
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: "total, prev, pager, next, sizes, jumper",
        total: 0,
        selectRows: "",
        elementLoadingText: "正在加载...",
        moreQueryFlag: false,
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          tempName_LIKE: "",
          tableType_EQ: "",
        },

        dict:{},
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
    mounted() {
      this.dict.table_type = this.$getDictList("table_type");
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
      handleCopy() {
        let _this = this;
        let row = this.selectRows[0];
        if (row && row.id) {
          this.$basePrompt(
            {
              content: "请输入模板名称",
              title: null,
              inputValidator: (value) => {
                if(!value){
                  return false;
                }
                // 验证
                return isGeneralWithChinese(value);
              },
              inputErrorMessage: "模板名称为空 或 只能为汉字、字母、数字和下划线！",
              callback1: async ({value}) => {
                const {msg} = await doCopy({
                  id: row.id,
                  tempName: value
                });
                this.$baseMessage(msg, "success");
                // 刷新数据
                _this.fetchData();
              }
          });
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm("你确定要删除当前项吗", null, async () => {
            const { msg } = await doDelete({ id: row.id });
            this.$baseMessage(msg, "success");
            await this.fetchData();
          });
        }
      },

      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.fetchData();
      },
      moreQuery(){
        this.moreQueryFlag = !this.moreQueryFlag;
      },
      queryData() {
        this.queryForm.pageNo = 1;
        this.fetchData();
      },
      async fetchData() {
        this.listLoading = true;
        const { data } = await getList(this.queryForm);
        if(isNotNull(data)){
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
