<template>
  <div class="orgManagement-container">
    <el-row>
      <el-col>
        <vab-query-form>
          <vab-query-form-left-panel :span="12">

            <el-button
              v-if="$perms('system_org_insert')"
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
        </vab-query-form>

        <el-table
          ref="tableTreeData"
          v-loading="listLoading"
          :data="data"
          :element-loading-text="elementLoadingText"
          row-key="orgCode"
          border
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            show-overflow-tooltip
            prop="orgCode"
            label="编号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="orgName"
            label="名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="orgType"
            label="类型"
          >
            <template slot-scope="scope">
              <span>
                <el-tag v-if="scope.row.orgType === '1' ">
                  {{ $getDictNameByValue('org_type', scope.row.orgType) }}
                </el-tag>
                <el-tag v-if="scope.row.orgType === '2' " type="warning">
                  {{ $getDictNameByValue('org_type', scope.row.orgType) }}
                </el-tag>
                <el-tag v-if="scope.row.orgType === '3' " type="success">
                  {{ $getDictNameByValue('org_type', scope.row.orgType) }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sortNo"
            label="排序"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="操作"
            width="200"
            v-if="$perms('system_org_insert') || $perms('system_org_update') || $perms('system_org_delete')"
          >
            <template v-slot="scope">
              <!-- 最低岗位 不允许继续添加下级 -->
              <el-button
                v-if="$perms('system_org_insert')"
                type="text"
                @click="handleInsertByParent(scope.row)"
                :disabled="scope.row.orgType === '3' "
              > 添加下级 </el-button>
              <el-button
                v-if="$perms('system_org_update')"
                type="text"
                @click="handleUpdate(scope.row)"
              > 编辑 </el-button>
              <el-button
                v-if="$perms('system_org_delete')"
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
  import { getTree, doDelete } from "@/api/system/org/orgManagement";
  import Edit from "./components/OrgManagementEdit";

  export default {
    name: "OrgManagement",
    components: { Edit },
    data() {
      return {
        dict: {
          org_type: this.$getDictList("org_type"),
          no_yes: this.$getDictList("no_yes"),
        },
        data: [],
        defaultProps: {
          children: "children",
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
      // 获得树数据
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
          rowTmp.parentName = row.orgName;
          // 上级编号
          rowTmp.parentCode = row.orgCode;
          // 上级类型
          rowTmp.parentType = row.orgType;
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
