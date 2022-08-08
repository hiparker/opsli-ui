<template>
  <div class="orgManagement-container">
    <el-row>
      <el-col>
        <vab-query-form>
          <vab-query-form-left-panel :span="12">

            <el-button
              v-if="$perms('system_org_insert')
                && null != userInfo && (userInfo.izSuperAdmin || '3' === userInfo.dataScope)
              "
              icon="el-icon-plus"
              type="primary"
              @click="handleInsert"
            > 添加 </el-button>

          </vab-query-form-left-panel>
        </vab-query-form>

        <el-table
          ref="tableTreeData"
          v-loading="listLoading"
          :data="data"
          :element-loading-text="elementLoadingText"
          row-key="id"
          :default-expand-all="false"
          lazy
          :load="loadNode"
          :tree-props="defaultProps"
        >
          <el-table-column
            show-overflow-tooltip
            prop="orgCode"
            label="机构唯一编号"
            min-width="200"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="orgName"
            label="机构名称"
            min-width="150"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="sortNo"
            label="排序"
          ></el-table-column>

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
            v-if="$perms('system_org_insert') || $perms('system_org_update') || $perms('system_org_delete')"
          >
            <template v-slot="scope">
              <el-button
                v-if="$perms('system_org_update')"
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
                    v-if="$perms('system_org_insert')"
                    @click.native="handleInsertByParent(scope.row)"
                  >添加下级</el-dropdown-item>

                  <el-dropdown-item
                    v-if="$perms('system_org_delete')"
                    @click.native="handleDelete(scope.row)"
                  >删除</el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <edit ref="edit" @refreshNodeBy="refreshNodeBy"></edit>
  </div>
</template>

<script>
  import { getTreeLazy, doDelete } from "@/api/system/org/orgManagement";
  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo } from "@/api/user";

  import Edit from "./components/OrgManagementEdit";
  import {isNull} from "@/utils/validate";

  export default {
    name: "OrgManagement",
    components: { Edit },
    data() {
      return {
        userInfo: {},
        dict: {
          org_type: this.$getDictList("org_type"),
          no_yes: this.$getDictList("no_yes"),
        },
        // 0 根目录
        defaultNode: "0",
        tmpTreeData: {},
        data: [],
        defaultProps: {
          children: "children",
          hasChildren: 'hasChildren',
          label: "orgName",
        },
        queryForm: {
          orgCode_EQ: "",
          orgName_LIKE: "",
        },
        isExpand: false,
        listLoading: true,
        elementLoadingText: "正在加载...",
      };
    },
    async created() {
      // 获得当前用户
      await this.getCurrUser();
      // 获得树数据
      await this.fetchData();
    },
    methods: {
      handleInsert(row) {
        this.$refs["edit"].showEdit();
      },
      handleInsertByParent(row) {
        if (row.id) {
          if(row.parentIds.split(",").length > 3) {
            this.$baseMessage("组织树深度最大支持4层", "error");
            return;
          }

          let rowTmp = {};
          // 上级Id
          rowTmp.parentId = row.id;
          // 上级名称
          rowTmp.parentName = row.orgName;
          // 上级编号
          rowTmp.parentCode = row.orgCode;

          this.$refs["edit"].showEdit(rowTmp);
        }
      },
      handleUpdate(row) {
        if(row) {
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
      // 查询匹配数据
      queryData() {
        this.fetchData();
      },


      // 获得菜单数据
      async fetchData() {
        this.listLoading = true;
        const { data } = await getTreeLazy({parentId: this.defaultNode});
        this.data = data;
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },

      //  刷新数据
      refreshNodeBy(id){
        if(isNull(this.tmpTreeData[id])){
          this.fetchData();
        }else{
          // 通过节点id找到对应树节点对象
          let tree = this.tmpTreeData[id].tree;
          let treeNode = this.tmpTreeData[id].treeNode;
          let resolve = this.tmpTreeData[id].resolve;
          this.loadNode(tree, treeNode, resolve)
        }
      },

      //懒加载时触发
      async loadNode(tree, treeNode, resolve) {
        // 获得树数据
        const { data } = await getTreeLazy({parentId: tree.id});
        // 2021-06-07 暂时先重载所有路由 来解决数据冲突问题
        if(!data || data.length === 0){
          // 重载所有路由
          this.$baseEventBus.$emit("reloadRouterView");
          return;
        }
        this.tmpTreeData[tree.id] = {tree, treeNode, resolve};
        resolve(data);
      },

      // 遍历
      forArr(arr, isExpand) {
        arr.forEach(i => {
          // toggleRowExpansion(i, isExpand)用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
          this.$refs["tableTreeData"].toggleRowExpansion(i, isExpand)
          if (i.children) {
            this.forArr(i.children, isExpand)
          }
        })
      },
      handleNodeClick(data) {
        this.fetchData();
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
