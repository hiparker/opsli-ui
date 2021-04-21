<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    width="350px"
    @close="close"
    class="menu-management-choose"
    append-to-body
  >
    <el-col>
      <el-input v-model="filterText" placeholder="输入关键字过滤" />
      <el-tree
        v-loading="chooseLoading"
        ref="menuTree"
        :data="menuData"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :check-on-click-node="true"
        :check-strictly="false"
        :props="defaultProps"
        class="vab-filter-tree"
        node-key="id"
        lazy
        :load="loadNode"
      >
      </el-tree>
    </el-col>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { isNull} from "@/utils/validate";
  import {getTreeChooseLazy, getTreeLazy} from "@/api/menuManagement";
  import { doGetPerms, doSetPerms } from "@/api/roleManagement";

  export default {
    name: "MenuManagementChoose",
    data() {
      return {
        menuId: "",
        menuData: [],
        filterText: "",
        // 0 根目录
        defaultNode: "0",
        tmpTreeData: {},
        defaultProps: {
          children: "children",
          label: "menuName",
          isLeaf: "isLeaf"
        },
        dialogTitle: "选择菜单",
        dialogVisible: false,
        chooseLoading: false
      };
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      },
    },
    methods: {
      showMenuChoose(row) {
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.menuData = [];
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
        // 获得树数据
        const { data } = await getTreeChooseLazy({parentId: nodeData.id});
        this.tmpTreeData[nodeData.id] = {treeNode, resolve};
        resolve(data);
      },

      // 获得菜单数据
      async fetchData() {
        this.chooseLoading = true;
        const { data } = await getTreeChooseLazy();
        this.menuData = data;
        setTimeout(() => {
          this.chooseLoading = false;
        }, 300);
      },
      // 节点过滤操作
      filterNode(value, data) {
        if (!value) return true;
          return data.name.indexOf(value) !== -1;
      },

      // ===================
      // 数组去重
      unique (arr) {
        return Array.from(new Set(arr))
      },

    },

  };
</script>
