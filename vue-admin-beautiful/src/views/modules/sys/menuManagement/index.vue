<template>
  <div class="menuManagement-container">
    <el-row>
      <el-col>
        <vab-query-form>
          <vab-query-form-left-panel :span="12">

            <el-button
              v-if="$perms('system_menu_insert')"
              icon="el-icon-plus"
              type="primary"
              @click="handleInsert"
            > 添加 </el-button>

            <el-button
              icon="el-icon-sort"
              type="primary"
              @click="handleExpand"
            > 展开数据 </el-button>

          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="12">
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableTreeData"
          v-loading="listLoading"
          :data="data"
          :element-loading-text="elementLoadingText"
          row-key="id"
          border
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >

          <el-table-column
            show-overflow-tooltip
            prop="menuName"
            label="名称"
            width="280"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="type"
            label="类型"
          >
            <template slot-scope="scope">
              <span>
                <el-tag v-if="scope.row.type === '1' ">
                  {{ $getDictNameByValue('menu_type', scope.row.type) }}
                </el-tag>
                <el-tag v-if="scope.row.type === '2' " type="warning">
                  {{ $getDictNameByValue('menu_type', scope.row.type) }}
                </el-tag>
                <el-tag v-if="scope.row.type === '3' " type="info">
                  {{ $getDictNameByValue('menu_type', scope.row.type) }}
                </el-tag>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="sortNo"
            label="排序"
          ></el-table-column>

          <el-table-column show-overflow-tooltip label="是否隐藏">
            <template slot-scope="scope">
              <span>
                <el-tag v-if="scope.row.hidden === '0' " type="success">
                  {{ $getDictNameByValue('no_yes', scope.row.hidden) }}
                </el-tag>
                <el-tag v-if="scope.row.hidden === '1' " type="warning">
                  {{ $getDictNameByValue('no_yes', scope.row.hidden) }}
                </el-tag>
              </span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip label="总是显示">
            <template slot-scope="scope">
              <span>
                {{ $getDictNameByValue('no_yes', scope.row.alwaysShow) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="url"
            label="路径"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="component"
            label="组件路径"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="redirect"
            label="重定向"
          ></el-table-column>

          <el-table-column show-overflow-tooltip label="图标">
            <template slot-scope="scope">
              <vab-icon
                v-if="scope.row.icon"
                :icon="['fas', scope.row.icon]"
              ></vab-icon>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            fixed="right"
            label="操作"
            width="200"
            v-if="$perms('system_menu_insert') || $perms('system_menu_update') || $perms('system_menu_delete')"
          >
            <template v-slot="scope">
              <el-button
                v-if="$perms('system_menu_insert')"
                type="text"
                @click="handleInsertByParent(scope.row)"
              > 添加下级 </el-button>
              <el-button
                v-if="$perms('system_menu_update')"
                type="text"
                @click="handleUpdate(scope.row)"
              > 编辑 </el-button>
              <el-button
                v-if="$perms('system_menu_delete')"
                type="text"
                @click="handleDelete(scope.row)"
              > 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <edit ref="edit" @fetchData="fetchData"></edit>
  </div>
</template>

<script>
  import { getTree, doDelete } from "@/api/menuManagement";
  import Edit from "./components/MenuManagementEdit";

  export default {
    name: "MenuManagement",
    components: { Edit },
    data() {
      return {
        dict: {
          menu_type: this.$getDictList("menu_type"),
          no_yes: this.$getDictList("no_yes"),
        },
        data: [],
        defaultProps: {
          children: "children",
          label: "menuName",
        },
        queryForm: {
        },
        isExpand: false,
        listLoading: true,
        elementLoadingText: "正在加载...",
      };
    },
    async created() {
      // 获得菜单数据
      await this.fetchData();
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
          rowTmp.parentName = row.menuName;
          this.$refs["edit"].showEdit(rowTmp);
        }
      },
      handleUpdate(row) {
          this.$refs["edit"].showEdit(row);
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm("你确定要删除当前项吗", null, async () => {
            const { success, msg } = await doDelete({ id: row.id });
            if(success){
              this.$baseMessage(msg, "success");
              await this.fetchData();
            }
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
        const { data } = await getTree(this.queryForm);
        this.data = data;
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },



      // 是否展开table(展开与折叠切换)
      handleExpand() {
        this.isExpand = !this.isExpand
        this.$nextTick(() => {
          this.forArr(this.data, this.isExpand)
        })
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
    },
  };
</script>
