<template>
  <div class="dictManagement-container">
    <el-row :gutter="15">
      <!-- 字典主表 -->
      <el-col>
        <vab-query-form>
          <vab-query-form-left-panel :span="6">
            <el-button
              v-if="$perms('system_dict_insert')"
              icon="el-icon-plus"
              type="primary"
              @click="handleInsert"
            > 添加 </el-button>


          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="18">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.typeCode_EQ"
                  placeholder="请输入字典类型编号"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.typeName_LIKE"
                  placeholder="请输入字典类型名称"
                  clearable
                />
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
          ref="dictTable"
          v-loading="listLoading"
          :data="list"
          :element-loading-text="elementLoadingText"
          :highlight-current-row="true"
          @current-change="setSelectRows"
        >

          <el-table-column
            show-overflow-tooltip
            prop="typeCode"
            label="字典类型编号"
            min-width="110"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="typeName"
            label="字典类型名称"
            min-width="110"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izLock"
            label="是否内置"
          >
            <template slot-scope="scope">
              <span>
                <el-tag v-if="scope.row.izLock === '0' " type="success">
                  {{ $getDictNameByValue('no_yes', scope.row.izLock) }}
                </el-tag>
                <el-tag v-if="scope.row.izLock === '1' " type="info">
                  {{ $getDictNameByValue('no_yes', scope.row.izLock) }}
                </el-tag>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="remark"
            label="备注"
          ></el-table-column>

          <el-table-column
            fixed="right"
            show-overflow-tooltip
            label="操作"
            width="160"
            v-if="$perms('system_dict_update') || $perms('system_dict_delete') || $perms('system_dict_setDict')"
          >
            <template v-slot="scope">

              <el-button
                v-if="$perms('system_dict_update')"
                type="text"
                @click="handleUpdate(scope.row)"
              > 编辑 </el-button>

              <el-divider direction="vertical"></el-divider>

              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                >
                  <!-- 添加下级 只有上级为 菜单是才可以 -->
                  <el-dropdown-item
                    v-if="$perms('system_dict_setDict')"
                    @click.native="setDict(scope.row)"
                  >设置字典</el-dropdown-item>

                  <el-dropdown-item
                    v-if="$perms('system_dict_delete')"
                    @click.native="handleDelete(scope.row)"
                  >删除</el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
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
      </el-col>

    </el-row>

    <!-- 编辑 -->
    <edit ref="edit" @fetchData="fetchData"></edit>

    <!-- 字典详情 -->
    <dict-detail ref="dict-detail"></dict-detail>

  </div>
</template>

<script>
  import { getList, doDelete } from "@/api/system/dict/dictManagement";
  import { isNull } from "@/utils/validate";
  import dictDetail from "./components/dictDetail"
  import Edit from "./components/dictManagementEdit"

  export default {
    name: "DictManagement",
    components: { dictDetail,Edit },
    data() {
      return {
        userInfo: null,
        list: null,
        listLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        currentRow: null,
        elementLoadingText: "正在加载...",
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          typeCode_EQ: "",
          typeName_LIKE: "",
        },
      };
    },
    created() {
      // 获得字典数据
      this.fetchData();
    },
    methods: {
      setDict(row){
        this.$refs["dictTable"].setCurrentRow(row);
        this.$refs["dict-detail"].show(row);
      },
      setSelectRows(val) {
        this.currentRow = val;
      },
      handleInsert() {
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
      queryData() {
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
<style lang="scss" scoped>
.dictManagement-container {



}
</style>
