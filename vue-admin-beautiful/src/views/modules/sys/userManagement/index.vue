<template>
  <div class="userManagement-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4">
        <el-input v-model="filterText" placeholder="输入关键字过滤" />
        <el-tree
          ref="tableTreeData"
          v-loading="treeLoading"
          row-key="id"
          lazy accordion
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :element-loading-text="elementLoadingText"
          :filter-node-method="filterNode"
          :load="loadNode"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="vab-custom-tree-node">
            <span class="vab-tree-item">
              {{ node.label }}
              <el-tag v-if="data.orgType === '1' ">
                {{ $getDictNameByValue('org_type', data.orgType) }}
              </el-tag>
              <el-tag v-if="data.orgType === '2' " type="warning">
                {{ $getDictNameByValue('org_type', data.orgType) }}
              </el-tag>
              <el-tag v-if="data.orgType === '3' " type="success">
                {{ $getDictNameByValue('org_type', data.orgType) }}
              </el-tag>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
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
              v-if="$perms('system_user_setRole')"
              :disabled="selectRows.length !== 1"
              icon="el-icon-user-solid"
              type="success"
              @click="setRoles"
            > 设置角色 </el-button>

            <el-button
              v-if="$perms('system_user_setOrg')"
              :disabled="selectRows.length !== 1"
              icon="el-icon-s-data"
              type="success"
              @click="setOrg"
            > 设置组织 </el-button>

            <el-button
              v-if="$perms('system_user_updatePassword')"
              :disabled="selectRows.length !== 1"
              icon="el-icon-lock"
              type="warning"
              @click="updatePassword"
            > 修改密码 </el-button>

            <el-button
              v-if="$perms('system_user_resetPassword')"
              :disabled="selectRows.length !== 1"
              icon="el-icon-refresh"
              type="warning"
              @click="resetPassword"
            >
              重置密码
            </el-button>

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
            width="140"
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
            width="130"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="操作"
            width="200"
            v-if="$perms('system_user_update') || $perms('system_user_delete')"
          >
            <template v-slot="scope">
              <el-button
                v-if="$perms('system_user_update')"
                type="text"
                @click="handleEdit(scope.row)"
              > 编辑 </el-button>
              <el-button
                v-if="$perms('system_user_delete')"
                type="text"
                @click="handleDelete(scope.row)"
              >  删除 </el-button>
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
        <set-org ref="set-org"></set-org>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import { getList, doDelete, doDeleteAll, doResetPasswordById, doEnableAccount } from "@/api/userManagement";
  import { getTreeLazyByUser } from "@/api/orgManagement";
  import Edit from "./components/UserManagementEdit";
  import Roles from "./components/UserManagementRoles";
  import SetOrg from "./components/UserManagementSetOrg";
  import UpdatePassword from "./components/UserManagementPassword";
  import { isNull } from "@/utils/validate";

  export default {
    name: "UserManagement",
    components: { Edit,Roles,UpdatePassword,SetOrg },
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
          username_EQ: "",
          realName_LIKE: "",
          no_EQ: "",
          companyId: "",
          departmentId: "",
          postId: ""
        },

        // 组织树
        filterText: "",
        defaultNode: "0",
        treeData:[],
        defaultProps: {
          children: "children",
          label: "orgName",
        },
        treeLoading: false,
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
      // 设置组织
      setOrg() {
        let row = this.selectRows[0];
        this.$refs["set-org"].showEdit(row);
      },
      // 设置角色
      setRoles() {
        let row = this.selectRows[0];
        this.$refs["roles"].showRole(row);
      },
      // 修改密码
      updatePassword() {
        let row = this.selectRows[0];
        this.$refs["update-password"].showUpdatePassword(row);
      },
      // 重置密码
      resetPassword(){
        let userId;
        try {
          userId = this.selectRows[0].id;
        }catch (e){}

        if(isNull(userId)){
          this.$baseMessage('未选择用户', "error");
          return;
        }

        this.$baseConfirm("你确定要重置当前用户密码吗", null, async () => {
          doResetPasswordById({ userId : userId}).then(ret => {
            // 重置密码
            const { success, msg } = ret;
            if(success){
              this.$baseMessage(msg, "success");
            }
          });
        });
      },
      setSelectRows(val) {
        this.selectRows = val;
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs["edit"].showEdit(row);
        } else {
          this.$refs["edit"].showEdit();
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
              enable: enable
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
        const { data } = await getList(this.queryForm);
        if(!isNull(data)){
          this.list = data.rows;
          this.total = data.total;
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
        }
      },

      // ============ 组织树
      handleNodeClick(node){
        if(!isNull(node)){
          let orgType = node.orgType;
          this.queryForm.companyId = "";
          this.queryForm.departmentId = "";
          this.queryForm.postId = "";

          // 公司
          if("1" === orgType){
            this.queryForm.companyId = node.id;
          }
          // 部门
          else if("2" === orgType){
            this.queryForm.departmentId = node.id;
          }
          // 岗位
          else if("3" === orgType){
            this.queryForm.postId = node.id;
          }
          // -- 未分组
          else if("-1" === orgType){
            this.queryForm.companyId = node.id;
          }
        }
        // 查询数据
        this.queryData();
      },

      //懒加载时触发
      async loadNode(tree, resolve) {
        let treeId = this.defaultNode;
        if(!isNull(tree.data) && !isNull(tree.data.id)){
          treeId = tree.data.id;
        }
        // 获得树数据
        const { data } = await getTreeLazyByUser({parentId: treeId});
        resolve(data);
      },
      // 节点过滤操作
      filterNode(value, data) {
        if (!value) return true;
        return data.orgName.indexOf(value) !== -1;
      },

    },
  };
</script>
