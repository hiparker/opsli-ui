<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="300px"
    @close="close"
  >
    <el-col>
      <el-tree
        ref="gridTree"
        :data="gridTreeData"
        :default-checked-keys="defaultCheckedKeys"
        :default-expanded-keys="defaultExpendedKeys"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :check-on-click-node="true"
        :check-strictly="false"
        :props="defaultProps"
        class="vab-filter-tree"
        node-key="id"
        show-checkbox
        @check="checkNode"
        @node-click="nodeClick"
        @node-collapse="nodeCollapse"
        @node-expand="nodeExpand"
      >
      <span slot-scope="{ node, data }" class="vab-custom-tree-node">
        <span class="vab-tree-item">
          <i v-if="node.data.rank === 4" class="el-icon-s-custom"></i>
          {{ node.label }}
        </span>
      </span>
      </el-tree>
    </el-col>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {isCode, isName, isNull} from "@/utils/validate";
  import {getTree} from "@/api/menuManagement";

  export default {
    name: "RoleManagementPerms",
    data() {
      return {
        gridTreeData:{},
        treeFlag: 0,
        filterText: "",
        defaultExpendedKeys: [],
        defaultCheckedKeys: [],
        defaultProps: {
          children: "children",
          label: "menuName",
        },
        dialogTitle: "添加节点",
        dialogVisible: false,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.fetchData();
      });
    },
    watch: {
      filterText(val) {
        this.$refs.gridTree.filter(val);
      },
    },
    methods: {
      showPerms(row) {
        this.dialogTitle = "设置权限";
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
      },
      // 保存权限
      save(){
        let nodes = this.$refs.gridTree.getCheckedKeys().concat(
                          this.$refs.gridTree.getHalfCheckedKeys());

        console.log(nodes);
      },
      // 获得菜单数据
      async fetchData() {
        this.listLoading = true;
        const { data } = await getTree();
        this.gridTreeData = data;
        if (this.treeFlag) {
          this.openTree(this.gridTreeData, 2);
        }
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },
      // 点击叶子节点
      nodeClick(data, node, el) {},
      // 节点选中操作
      checkNode(data, node, el) {
        this.checkNodeKeys = node.checkedKeys;
      },
      // 节点展开操作
      nodeExpand(data, node, el) {
        this.defaultExpendedKeys.push(data.id);
      },
      // 节点关闭操作
      nodeCollapse(data, node, el) {
        this.defaultExpendedKeys.splice(
          this.defaultExpendedKeys.findIndex((item) => item.id === data.id),
          1
        );
      },
      // 节点过滤操作
      filterNode(value, data) {
        if (!value) return true;
          return data.name.indexOf(value) !== -1;
        },
      },
      // 树level小于n级展开方法
      openTree(treeData, n) {
        const each = (data) => {
          data.forEach((e) => {
            if (e.rank <= n) {
              this.defaultExpendedKeys.push(e.id);
            }
            if (e.children.length > 0) {
              each(e.children);
            }
          });
        };

        each(treeData);
      },
  };
</script>
