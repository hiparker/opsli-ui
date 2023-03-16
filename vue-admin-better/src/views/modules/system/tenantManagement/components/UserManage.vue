<template>
  <el-drawer
    size="55%"
    :visible.sync="userManageVisible"
    :close-on-click-modal="false"
    :before-close="close"
    :title="title"
    class="UserManage-container"
  >
  <div class="userManagement-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-collapse-transition>
          <div class="more-query" v-show="this.moreQueryFlag">
            <!-- 更多查找 -->
            <vab-query-form>
              <vab-query-form-left-panel :span="24">
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
                      v-model.trim="queryForm.no_EQ"
                      placeholder="请输入工号"
                      clearable
                    />
                  </el-form-item>

                </el-form>
              </vab-query-form-left-panel>

            </vab-query-form>
            <el-divider></el-divider>
          </div>
        </el-collapse-transition>

        <vab-query-form>
          <vab-query-form-left-panel :span="14" style="float: left">
            <el-button
              v-if="$perms('system_user_insert')"
              icon="el-icon-plus"
              type="primary"
              @click="handleEdit"
            > 添加 </el-button>

            <el-button
              v-if="$perms('system_user_delete')"
              :disabled="!selectRows.length > 0"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete"
            > 批量删除 </el-button>

          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="10" style="float: right">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>

              <el-form-item>
                <el-input
                  v-model.trim="queryForm.realName_LIKE"
                  placeholder="请输入昵称"
                  clearable
                />
              </el-form-item>

              <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">
                  查询
                </el-button>

                <el-button icon="el-icon-search" @click="moreQuery">
                  更多
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
            prop="enable"
            label="启用状态"
            width="95"
            v-if="$perms('system_user_enable')"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                active-value="1"
                inactive-value="0"
                @change="handleEnableAccount(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="用户名"
            width="95"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="realName"
            label="昵称"
            width="95"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="no"
            label="工号"
            width="95"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="mobile"
            label="手机"
            width="120"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="email"
            label="邮箱"
            width="160"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="loginIp"
            label="最后登录IP"
            width="95"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="remark"
            label="备注"
            min-width="130"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            fixed="right"
            label="操作"
            width="130"
            v-if="$perms('system_user_update') || $perms('system_user_delete')"
          >
            <template v-slot="scope">
              <el-button
                v-if="$perms('system_user_update')"
                type="text"
                @click="handleEdit(scope.row)"
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
                    v-if="$perms('system_user_setRole')"
                    @click.native="setRoles(scope.row)"
                  >授权角色</el-dropdown-item>

                  <el-dropdown-item
                    v-if="$perms('system_user_updatePassword')"
                    @click.native="updatePassword(scope.row)"
                  >修改密码</el-dropdown-item>

                  <el-dropdown-item
                    v-if="$perms('system_user_resetPassword')"
                    @click.native="resetPassword(scope.row)"
                  >重置密码</el-dropdown-item>

                  <el-dropdown-item
                    v-if="$perms('system_user_delete')"
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
        <roles ref="roles"></roles>
        <update-password ref="update-password"></update-password>
      </el-col>
    </el-row>
  </div>
  </el-drawer>
</template>

<script>

  import { getListByTenant, doDelete, doDeleteAll, doResetPasswordById,
    doEnableAccount } from "@/api/system/user/userManagement";
  import Edit from "../../userManagement/components/UserManagementEdit";
  import Roles from "../../userManagement/components/UserManagementRoles";
  import UpdatePassword from "../../userManagement/components/UserManagementPassword";
  import { isNull } from "@/utils/validate";

  export default {
    name: "UserManagement",
    components: { Edit, Roles,
      UpdatePassword
    },
    data() {
      return {
        activeName: "1",
        title: "",
        tenantId: "",
        userManageVisible: false,
        isGen: false,
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
          username_EQ: "",
          realName_LIKE: "",
          tenantId_EQ: "",
          no_EQ: ""
        },
      };
    },
    created() {
      this.fetchData();
    },
    watch: {
      filterText(val) {
        this.$refs["tableTreeData"].filter(val);
      },
    },
    methods: {
      show(row){
        this.userManageVisible = true;
        this.tenantId = row.id;
        this.title = row.tenantName + " 管理用户";
        this.queryForm.tenantId_EQ = this.tenantId;
        this.fetchData();
      },
      close(){
        this.list = null;
        this.title = "";
        this.tenantId = "";
        this.queryForm.tenantId_EQ = "";
        this.userManageVisible = false;
      },
      // 设置角色
      setRoles(row) {
        if(!row){
          this.$baseMessage("请选择操作用户", "error");
        }
        this.$refs["roles"].showRole(row, this.activeName);
      },
      // 修改密码
      updatePassword(row) {
        if(!row){
          this.$baseMessage("请选择操作用户", "error");
        }
        this.$refs["update-password"].showUpdatePassword(row);
      },
      // 重置密码
      resetPassword(row){
        if(!row){
          this.$baseMessage("请选择操作用户", "error");
        }

        if(isNull(row.id)){
          this.$baseMessage('未选择用户', "error");
          return;
        }

        this.$baseConfirm("你确定要重置当前用户密码吗", null, async () => {
          doResetPasswordById({ userId : row.id}).then(ret => {
            // 重置密码
            const { msg } = ret;
            this.$baseMessage(msg, "success");
          });
        });
      },
      setSelectRows(val) {
        this.selectRows = val;
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs["edit"].showEdit(row, {
            tenantId: this.tenantId,
            izTenantAdmin: '1'
          });
        } else {
          this.$refs["edit"].showEdit(null, {
            tenantId: this.tenantId,
            izTenantAdmin: '1'
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
      async handleEnableAccount(row) {
        const enable = row.enable;
        // 回退原有状态
        if(row.enable === "0") row.enable = "1"
        else if(row.enable === "1") row.enable = "0"

        if (row.id) {
            const { msg } = await doEnableAccount({
              userId: row.id,
              enabled: enable
            });
            row.enable = enable;
            this.$baseMessage(msg, "success");
        } else {
            this.$baseMessage("未选中任何行", "error");
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
        const { data } = await getListByTenant(this.queryForm);
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
<style scoped>
  .userManagement-container{
    padding: 15px;
  }
</style>
