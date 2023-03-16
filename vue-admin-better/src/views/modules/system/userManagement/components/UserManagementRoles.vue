<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    append-to-body
    width="750px"
    class="role-management-perms"
    @close="close"
  >
    <div class="adaptive-container">
      <div class="roleManagement-container">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
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
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="queryData"
                >
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="rolesTable"
          v-loading="listLoading"
          :data="list"
          :element-loading-text="elementLoadingText"
          row-key="id"
          @select="setSelectRows"
          @select-all="setSelectRows"
        >
          <!-- 复选框 -->
          <el-table-column
            show-overflow-tooltip
            type="selection"
          ></el-table-column>

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

          <el-table-column show-overflow-tooltip label="是否默认">
            <template slot-scope="scope">
              <span>
                <el-tag v-if="defRoleId === scope.row.id" type="success">
                  {{ $getDictNameByValue('no_yes', '1') }}
                </el-tag>
                <el-tag v-if="defRoleId !== scope.row.id" type="warning">
                  {{ $getDictNameByValue('no_yes', '0') }}
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
            fixed="right"
            label="操作"
            width="130"
          >
            <template v-slot="scope">
              <el-button
                type="text"
                :disabled="defRoleId === scope.row.id || !isSelected(scope.row.id)"
                @click="handleSetDef(scope.row.id)"
              > 设为默认 </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :layout="layout"
          :total="total"
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
  import { getList } from "@/api/system/role/roleManagement";
  import { isNull } from "@/utils/validate";
  import { getRoleIdsByUserId, doSetRoles } from "@/api/system/user/userManagement";
  import {doGetRoles} from "../../../../../api/system/user/userManagement";

  export default {
    name: "UserManagementRoles",
    components: {},
    data() {
      return {
        userId: "",
        defRoleId: "",
        list: [],
        listLoading: true,
        defaultCheckedKeys: [],
        tmpCheckedKeys: {},
        layout: "total, prev, pager, next, jumper",
        total: 0,
        selectRows: "",
        elementLoadingText: "正在加载...",
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          label_EQ: '',
          roleCode_EQ: "",
          roleName_LIKE: "",
        },
        dialogTitle: "设置角色",
        dialogVisible: false,
      };
    },
    created() {},
    methods: {
      showRole(row, activeName) {
        this.userId = row.id;

        // 初始化 查询标签
        this.queryForm.label_EQ = activeName;

        // 加载数据
        this.fetchData();
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.userId = "";
        this.list = [];
        this.queryForm.label_EQ = ''
        this.defRoleId = "";
        this.defaultCheckedKeys = [];
        this.tmpCheckedKeys = {};
      },
      // 设为默认
      handleSetDef(rowId){
        // 临时 存储选择状态
        this.defRoleId = rowId;
      },
      // 检测是否选中
      isSelected(id){
        // 合并数据 - 当前操作数据 + 默认数据
        let roleIds = [];
        for (let key in this.tmpCheckedKeys) {
          // 如果删除了默认选中参数 则执行删除操作
          for (let i = 0; i < this.tmpCheckedKeys[key].remove.length; i++) {
            this.removeByValue(
              this.defaultCheckedKeys,
              this.tmpCheckedKeys[key].remove[i].id
            );
          }

          // 合并 save 数据
          for (let i = 0; i < this.tmpCheckedKeys[key].save.length; i++) {
            roleIds.push(this.tmpCheckedKeys[key].save[i].id);
          }
        }

        // 合并默认数据
        for (let i = 0; i < this.defaultCheckedKeys.length; i++) {
          roleIds.push(this.defaultCheckedKeys[i]);
        }
        return roleIds.includes(id);
      },
      async save() {
        if(!this.defRoleId){
          this.$baseMessage("请设置默认角色", "error");
          return;
        }

        // 合并数据 - 当前操作数据 + 默认数据
        let roleIds = [];

        for (let key in this.tmpCheckedKeys) {
          // 如果删除了默认选中参数 则执行删除操作
          for (let i = 0; i < this.tmpCheckedKeys[key].remove.length; i++) {
            this.removeByValue(
              this.defaultCheckedKeys,
              this.tmpCheckedKeys[key].remove[i].id
            );
          }

          // 合并 save 数据
          for (let i = 0; i < this.tmpCheckedKeys[key].save.length; i++) {
            roleIds.push(this.tmpCheckedKeys[key].save[i].id);
          }
        }

        // 合并默认数据
        for (let i = 0; i < this.defaultCheckedKeys.length; i++) {
          roleIds.push(this.defaultCheckedKeys[i]);
        }

        // 执行 设置角色
        const { msg } = await doSetRoles({
          userId: this.userId,
          roleIds: this.unique(roleIds),
          defRoleId: this.defRoleId,
        });

        this.$baseMessage(msg, "success");

        await this.$emit("fetchData");
        this.close();
      },
      // row 操作
      setSelectRows(val, row) {
        this.selectRows = val;

        // 获得删除数据
        let delTemp = [];
        for (let i = 0; i < this.list.length; i++) {
          let flag = true;
          for (let j = 0; j < this.selectRows.length; j++) {
            if (this.list[i].id === this.selectRows[j].id) {
              flag = false;
              break;
            }
          }
          if (flag) {
            delTemp.push(this.list[i]);
          }
        }

        // 临时 存储选择状态
        this.tmpCheckedKeys[this.queryForm.pageNo] = {
          save: this.selectRows,
          remove: delTemp,
        };
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
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
        }

        const getRoles = await doGetRoles({ userId: this.userId });
        if (!isNull(getRoles)) {
          const {roleIds, defRoleId} = getRoles.data;
          if (!isNull(roleIds)) {
            this.defaultCheckedKeys = roleIds;
          }
          if(isNull(this.defRoleId)){
            this.defRoleId = defRoleId;
          }
        }

        // 设置当前页选中数据
        let checkedKeys = this.tmpCheckedKeys[this.queryForm.pageNo];

        if (!isNull(checkedKeys)) {
          let checkData = checkedKeys.save;
          let delData = checkedKeys.remove;

          // 清空选中
          for (let i = 0; i < delData.length; i++) {
            for (let j = 0; j < this.list.length; j++) {
              if (this.list[j].id === delData[i].id) {
                this.$refs.rolesTable.toggleRowSelection(this.list[j], false);
                break;
              }
            }
          }

          // 设置选中
          for (let i = 0; i < checkData.length; i++) {
            for (let j = 0; j < this.list.length; j++) {
              if (this.list[j].id === checkData[i].id) {
                this.$refs.rolesTable.toggleRowSelection(this.list[j], true);
                break;
              }
            }
          }
        } else {
          // 默认设置选中
          for (let i = 0; i < this.defaultCheckedKeys.length; i++) {
            for (let j = 0; j < this.list.length; j++) {
              if (this.list[j].id === this.defaultCheckedKeys[i]) {
                this.$refs.rolesTable.toggleRowSelection(this.list[j], true);
                break;
              }
            }
          }
        }
      },
      // ============
      // 删除数组元素
      removeByValue(arr, val) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === val) {
            arr.splice(i, 1);
            break;
          }
        }
      },
      // 数组去重
      unique(arr) {
        return Array.from(new Set(arr));
      },
    },
  };
</script>
