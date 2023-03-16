<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    width="480px"
    class="org-single-choose"
    append-to-body
    @close="close"
  >
    <el-col>
      <el-input v-model="filterText" placeholder="输入关键字过滤" />
      <el-tree
        v-if="dialogVisible"
        ref="orgTree"
        v-loading="chooseLoading"
        :data="orgData"
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
  import { getTreeLazy } from "@/api/system/org/orgManagement";
  import { isNull } from "@/utils/validate";

  export default {
    name: "OrgSingleChoose",
    props: {
      parentId: {
        type: String,
        default: () => {
          return null;
        },
      },
    },
    data() {
      return {
        selfId: "",
        orgId: "",
        orgData: [],
        checkArr: [],
        params: {},
        filterText: "",
        tmpTreeData: {},
        defaultProps: {
          children: "children",
          label: "orgName",
          isLeaf: "isLeaf",
        },
        treeExpandData: ["0"],
        dialogTitle: "选择机构",
        dialogVisible: false,
        chooseLoading: false,
      };
    },
    watch: {
      filterText(val) {
        this.$refs.orgTree.filter(val);
      },
    },
    methods: {
      showOrgChoose(id, params) {
        this.selfId = id;
        this.params = params;
        this.dialogVisible = true;
      },
      showChoose(params) {
        this.params = params;
        this.dialogVisible = true;
      },
      showCheckChoose(check, params) {
        this.params = params;
        this.checkArr.push(check);
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.tmpTreeData = {};
        this.orgData = [];
        this.checkArr = [];
        this.selfId = "";
      },
      // 保存权限
      async save() {
        const node = this.$refs.orgTree.getCurrentNode();
        if (node) {
          this.$emit("choose", node, this.params);
          this.close();
        }
      },

      //懒加载时触发
      async loadNode(treeNode, resolve) {
        let that = this;
        const nodeData = treeNode.data;
        let parentId = nodeData.id;
        if (!parentId) {
          parentId = this.parentId;
        }
        // 获得树数据
        const { data } = await getTreeLazy({
          parentId: parentId,
          id: this.selfId,
        });

        this.tmpTreeData[nodeData.id] = { treeNode, resolve };
        resolve(data);

        // 设置选中数据 原理 选中叶子节点 自动勾选父节点
        if (!isNull(this.checkArr)) {
          setTimeout(() => {
            if (this.checkArr > 0) {
              this.checkArr.forEach((id) => {
                let node = that.$refs.orgTree.getNode(id);
                if (node && !this.$refs.orgTree.getCurrentKey()) {
                  that.$refs.orgTree.setCurrentKey(id);
                }
              });
            }
          }, 150);
        }
      },
      // 节点过滤操作
      filterNode(value, data) {
        if (!value) return true;
        return data.orgName.indexOf(value) !== -1;
      },

      // ===================
      // 数组去重
      unique(arr) {
        return Array.from(new Set(arr));
      },
    },
  };
</script>
