<template>
  <div class="areaManagement-container">
    <el-row>
      <el-col>
        <vab-query-form>
          <vab-query-form-left-panel :span="4">

            <el-button
              v-if="$perms('system_area_insert')"
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
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            show-overflow-tooltip
            prop="areaCode"
            label="编号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="areaName"
            label="名称"
          ></el-table-column>

          <el-table-column
            fixed="right"
            show-overflow-tooltip
            label="操作"
            width="130"
            v-if="$perms('system_area_insert') || $perms('system_area_update') || $perms('system_area_delete')"
          >
            <template v-slot="scope">

              <el-button
                v-if="$perms('system_area_update')"
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
                    v-if="$perms('system_area_insert')"
                    @click.native="handleInsertByParent(scope.row)"
                  >添加下级</el-dropdown-item>

                  <el-dropdown-item
                    v-if="$perms('system_area_delete')"
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
  import { getTree, doDelete } from "@/api/system/area/areaManagement";
  import Edit from "./components/AreaManagementEdit";
  import {isNull} from "@/utils/validate";

  export default {
    name: "AreaManagement",
    components: { Edit },
    data() {
      return {
        dict: {
        },
        // 0 世界级  ---- 86 中国
        defaultNode: "86",
        data: [],
        tmpTreeData: {},
        defaultProps: {
          children: "children",
          label: "areaName",
        },
        isExpand: false,
        listLoading: true,
        elementLoadingText: "正在加载...",
      }
    },
    created() {
      // 获得树数据
      this.refreshNodeBy();
    },
    methods: {
      handleInsert(row) {
        this.$refs["edit"].showEdit();
      },
      handleInsertByParent(row) {
        if (row.id) {
          let rowTmp = {};
          // 上级Id
          rowTmp.parentId = row.id;
          // 上级名称
          rowTmp.parentName = row.areaName;
          // 上级编号
          rowTmp.parentCode = row.areaCode;
          this.$refs["edit"].showEdit(rowTmp);
        }
      },
      handleUpdate(row) {
          this.$refs["edit"].showEdit(row);
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm("你确定要删除当前项吗", null, async () => {
            const { msg } = await doDelete({ id: row.id });
            this.$baseMessage(msg, "success");
            this.refreshNodeBy(row.parentId)
          });
        }
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
        const { data } = await getTree({parentId: tree.id});
        this.tmpTreeData[tree.id] = {tree, treeNode, resolve};
        resolve(data);
      },

      // 获得菜单数据
      async fetchData() {
        this.listLoading = true;
        const { data } = await getTree({parentId: this.defaultNode});
        this.data = data;
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },

      handleNodeClick(data) {
        this.fetchData();
      },
    },
  };
</script>
