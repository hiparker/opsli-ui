<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    width="350px"
    class="menu-management-choose"
    append-to-body
    @close="close"
  >
    <el-col>
      <el-input v-model="filterText" placeholder="输入关键字过滤" />
      <el-tree
        v-if="dialogVisible"
        ref="menuTree"
        v-loading="chooseLoading"
        :data="menuData"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :check-on-click-node="true"
        :check-strictly="false"
        :props="defaultProps"
        :default-expanded-keys="treeExpandData"
        class="vab-filter-tree"
        node-key="id"
        lazy
        :load="loadNode"
      />
    </el-col>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getTreeChooseLazy } from "@/api/system/menu/menuManagement";

  export default {
    name: "MenuManagementChoose",
    props: {
      value: {
        type: String,
        default: () => {
          return null;
        },
      },
    },
    data() {
      return {
        selfId: "",
        menuId: "",
        menuData: [],
        filterText: "",
        tmpTreeData: {},
        defaultProps: {
          children: "children",
          label: "menuName",
          isLeaf: "isLeaf",
        },
        treeExpandData: ["0"],
        dialogTitle: "选择菜单",
        dialogVisible: false,
        chooseLoading: false,
      };
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      },
    },
    methods: {
      showMenuChoose(id) {
        this.selfId = id;
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.tmpTreeData = {};
        this.menuData = [];
        this.selfId = "";
      },
      // 保存权限
      async save() {
        const node = this.$refs.menuTree.getCurrentNode();
        this.$emit("menuChoose", node);
        this.close();
      },

      //懒加载时触发
      async loadNode(treeNode, resolve) {
        const nodeData = treeNode.data;
        let parentId = nodeData.id;
        if (!parentId) {
          parentId = this.value;
        }
        // 获得树数据
        const { data } = await getTreeChooseLazy({
          parentId: parentId,
          id: this.selfId,
        });
        this.tmpTreeData[nodeData.id] = { treeNode, resolve };
        resolve(data);
      },

      // 节点过滤操作
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      // ===================
      // 数组去重
      unique(arr) {
        return Array.from(new Set(arr));
      },
    },
  };
</script>
