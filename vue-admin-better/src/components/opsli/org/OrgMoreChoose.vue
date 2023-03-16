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
        :highlight-current="false"
        :check-on-click-node="true"
        :check-strictly="true"
        :props="defaultProps"
        class="vab-filter-tree"
        node-key="id"
        default-expand-all
        show-checkbox
        @check-change="checkChange"
      />
    </el-col>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getTreeByDef } from "@/api/system/org/orgManagement";
  import { isNull } from "@/utils/validate";

  export default {
    name: "OrgMoreChoose",
    props: {
      isGen: {
        type: Boolean,
        default: () => {
          return true;
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
        treeExpandData: [],
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

        // 加载数据
        this.fetchData();
      },
      showChoose(params) {
        this.params = params;
        this.dialogVisible = true;

        // 加载数据
        this.fetchData();
      },
      showCheckChoose(checkArr, params) {
        this.params = params;
        if (checkArr && checkArr.length > 0) {
          this.checkArr = checkArr;
        }
        this.dialogVisible = true;

        // 加载数据
        this.fetchData();
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
        const nodes = this.$refs.orgTree.getCheckedNodes();
        this.$emit("choose", nodes, this.params);
        this.close();
      },

      // 获得组织数据
      async fetchData() {
        let that = this;
        const { data } = await getTreeByDef({
          isGen: this.isGen,
          id: this.selfId,
        });
        this.orgData = data;

        // 设置选中数据 原理 选中叶子节点 自动勾选父节点
        if (!isNull(this.checkArr)) {
          that.$nextTick(() => {
            if (this.checkArr.length > 0) {
              this.checkArr.forEach((id) => {
                let node = that.$refs.orgTree.getNode(id);
                if (node) {
                  that.$refs.orgTree.setChecked(node, true);
                }
              });
            }
          });
        }
      },

      // 节点状态发生改变
      checkChange(currNode, currNodeFlag) {
        if (currNode) {
          this.recursionDisableNode(currNode, currNodeFlag, currNode.id);
        }
      },
      // 递归禁用节点
      recursionDisableNode(currNode, disable, lockId) {
        let _this = this;
        if (!currNode || !currNode.children || currNode.children.length === 0) {
          return;
        }

        currNode.children.forEach((node) => {
          // 加解锁逻辑
          // 如果为 加锁
          //       只判断 当前节点锁为空 或 父节点锁不为空
          // 如果是 解锁
          //       只判断 当前节点锁为空 或 锁定ID == 当前节点ID == 父节点锁ID
          let lockFlag;
          if (currNode.lockId) {
            if (disable) {
              lockFlag = !node.lockId || disable;
            } else {
              lockFlag =
                !node.lockId || (lockId === node.lockId) === currNode.lockId;
            }
          } else {
            lockFlag = !node.lockId || lockId === node.lockId;
          }

          if (lockFlag) {
            if (disable) {
              // 绑定锁定对象ID
              node.lockId = lockId;
            } else {
              // 解锁
              node.lockId = undefined;
            }

            // 禁用当前按钮
            node.disabled = disable;
            // 默认状态为 未选中 (需要变化一下状态 否则不生效 )
            _this.$refs.orgTree.setChecked(node, true);
            _this.$refs.orgTree.setChecked(node, false);
            // 递归下级
            _this.recursionDisableNode(node, disable, lockId);
          }
        });
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
