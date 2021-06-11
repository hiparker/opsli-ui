<template>
  <div class="logsManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="10">

        <el-button
          v-if="$perms('dev_generator_insert')"
          icon="el-icon-plus"
          type="primary"
          @click="handleInsert"
        > 添加 </el-button>

        <el-button
          v-if="$perms('dev_generator_import')"
          icon="el-icon-plus"
          type="primary"
          @click="handleImport"
        > 从数据库导入 </el-button>

        <el-button
          v-if="$perms('dev_generator_delete')"
          :disabled="!selectRows.length > 0"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
        > 批量删除 </el-button>

        <el-button
          v-if="$perms('dev_generator_create')"
          :disabled="selectRows.length !== 1"
          icon="el-icon-plus"
          type="warning"
          @click="handleCreate"
        > 生成代码 </el-button>

        <el-button
          v-if="$perms('dev_generator_createMenu')"
          :disabled="selectRows.length !== 1"
          icon="el-icon-menu"
          type="warning"
          @click="showMenuChoose"
        > 生成菜单 </el-button>

      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>

          <el-form-item>
            <el-input
              v-model.trim="queryForm.tableName_LIKE"
              placeholder="请输入名称"
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
        prop="tableName"
        label="表名称"
        width="300"
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
        prop="comments"
        label="描述"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="jdbcType"
        label="数据库类型"
      >
        <template slot-scope="scope">
          <span>
            {{ $getDictNameByValue('jdbc_type', scope.row.jdbcType) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="izSync"
        label="是否同步"
      >
        <template slot-scope="scope">
          <span>
            <el-tag v-if="scope.row.izSync === '0' " type="info">
              {{ $getDictNameByValue('no_yes', scope.row.izSync) }}
            </el-tag>
            <el-tag v-if="scope.row.izSync === '1' " type="success">
              {{ $getDictNameByValue('no_yes', scope.row.izSync) }}
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
        show-overflow-tooltip
        label="操作"
        width="200"
      >
        <template v-slot="scope">

          <el-button
            v-if="$perms('dev_generator_update')"
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
                v-if="$perms('dev_generator_sync')"
                @click.native="handleSync(scope.row)"
              >同步</el-dropdown-item>

              <el-dropdown-item
                v-if="$perms('dev_generator_delete')"
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

    <edit ref="edit" @fetchData="fetchData"></edit>

    <show-database-tables ref="show-database-tables" @fetchData="fetchData"></show-database-tables>

    <gen-create ref="gen-create"></gen-create>

    <menu-management-choose
      ref="menu-management-choose"
      @menuChoose="handleCreateMenu"
    ></menu-management-choose>

  </div>
</template>

<script>
  import { getList, doDelete, doDeleteAll, doSync, doCreateMenu } from "@/api/generator/tableManagement";
  import { isNull } from "@/utils/validate";
  import Edit from "./components/edit/TableEdit.vue";
  import MenuManagementChoose from "@/components/opsli/menu/MenuManagementChoose";
  import ShowDatabaseTables from "./components/showDatabaseTables";
  import GenCreate from "./components/GenCreate";

  export default {
    name: "CreateTableManagement",
    components: {GenCreate, Edit, ShowDatabaseTables,MenuManagementChoose },
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
          tableName_LIKE: ""
        }
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val;
      },
      handleInsert() {
        this.$refs["edit"].showEdit();
      },
      handleUpdate(row) {
        if (row.id) {
          this.$refs["edit"].showEdit(row);
        }
      },
      handleImport() {
        this.$refs["show-database-tables"].show();
      },
      handleCreate() {
        const rows = this.selectRows;
        if(rows === null || rows === undefined || rows.length === 0 || rows.length > 1){
          return;
        }
        this.$refs["gen-create"].showEdit(rows[0]);
      },

      showMenuChoose(){
         this.$refs["menu-management-choose"].showMenuChoose();
      },

      async handleCreateMenu(menuNode) {
        if(isNull(menuNode)){
          this.$baseMessage("请选择上级菜单", "warning");
          return;
        }

        const ids = this.selectRows.map((item) => item.id);
        if(ids === null || ids === undefined || ids.length === 0){
          return ;
        }
        const tableId = ids[0];

        const { msg } = await doCreateMenu({
          menuParentId: menuNode.id,
          tableId: tableId
        });
        this.$baseMessage(msg, "success");
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
      handleSync(row) {
        if (row.id) {
          this.$baseConfirm("同步后将清除当前表中所有数据，你确定要同步吗", null, async () => {
            const { msg } = await doSync({ id: row.id });
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
