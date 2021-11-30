<template>
  <div class="roleManagement-container">
    <el-tabs
      v-if="null != userInfo && null === this.userInfo.switchTenantId &&
            this.userInfo.tenantId === '0'"
      v-model="activeName"
      @tab-click="tagClick"
    >
      <el-tab-pane
        v-for="item in $getDictList('menu_role_label')"
        :key="item.dictValue"
        :label="item.dictName"
        :name="item.dictValue"
      ></el-tab-pane>
    </el-tabs>

    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          v-if="$perms('system_role_insert')"
          icon="el-icon-plus"
          type="primary"
          @click="handleInsert"
        > 添加 </el-button>

        <el-button
          v-if="$perms('system_role_delete')"
          :disabled="!selectRows.length > 0"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
        > 批量删除 </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.roleCode_EQ"
              placeholder="请输入角色编号"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.roleName_LIKE"
              placeholder="请输入角色名称"
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
        prop="roleCode"
        label="角色编号"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="roleName"
        label="角色名称"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="dataScope"
        label="数据范围"
      >
        <template slot-scope="scope">
              <span>
                {{ $getDictNameByValue('role_data_scope', scope.row.dataScope) }}
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
        width="130"
        v-if="$perms('system_role_update') || $perms('system_role_delete')"
      >
        <template v-slot="scope">
          <el-button
            v-if="$perms('system_role_update')"
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
              <el-dropdown-item
                v-if="$perms('system_role_setMenuPerms')"
                @click.native="setPerms(scope.row)"
              >授权菜单权限</el-dropdown-item>

              <el-dropdown-item
                v-if="$perms('system_role_delete')"
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
    <menu-perms ref="perms"></menu-perms>
  </div>
</template>

<script>
  import { getList, doDelete, doDeleteAll } from "@/api/system/role/roleManagement";
  import { getAccessToken } from "@/utils/accessToken"
  import { getUserInfo } from "@/api/user"
  import Edit from "./components/RoleManagementEdit";
  import MenuPerms from "./components/RoleManagementMenuPerms";
  import {isNull} from "@/utils/validate";

  export default {
    name: "RoleManagement",
    components: { Edit, MenuPerms },
    data() {
      return {
        activeName: "1",
        userInfo: {},
        list: null,
        listLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        selectRows: "",
        elementLoadingText: "正在加载...",
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          roleCode_EQ: "",
          roleName_LIKE: "",
          label_EQ: "",
        },
      };
    },
    created() {
      this.queryForm.label_EQ = this.activeName;
      this.getCurrUser();

      this.fetchData();
    },
    methods: {
      // Tag 点击
      tagClick(tab, event){
        this.queryForm.label_EQ = this.activeName;
        this.fetchData();
      },

      // 设置权限
      setPerms(row){
        if(!row){
          this.$baseMessage("请选择操作用户", "error");
        }
        this.$refs["perms"].showPerms(row, this.activeName);
      },
      setSelectRows(val) {
        this.selectRows = val;
      },
      handleInsert() {
        this.$refs["edit"].showEdit(null, this.activeName);
      },
      handleUpdate(row) {
        if (row.id) {
          this.$refs["edit"].showEdit(row, this.activeName);
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
      // 获取当前登录用户数据
      async getCurrUser() {
        this.listLoading = true;
        let accessToken = getAccessToken();
        const { data } = await getUserInfo(accessToken);
        if (!isNull(data)) {
          this.userInfo = Object.assign({}, data);
          setTimeout(() => {
            this.listLoading = false;
          }, 300)
        }
      },
    },
  };
</script>
