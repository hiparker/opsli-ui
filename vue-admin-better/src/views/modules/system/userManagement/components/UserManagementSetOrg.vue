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
      >
        <div slot-scope="{ node, data }" class="vab-custom-tree-node">
          <div class="vab-tree-item">
            {{ node.label }}

            <!-- 默认标识 -->
            <el-tag v-if="node.checked && data.def" >默认</el-tag>

            <!-- 设为默认按钮 -->
            <el-button
              v-if="node.checked && !data.def"
              type="text"
              v-on:click.stop="setDef(node, data)"
              class="set-def-btn"
            > 设为默认 </el-button>
          </div>
        </div>
      </el-tree>
    </el-col>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { deepClone } from "@/utils/clone";
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
        defId: "",
        params: {},
        filterText: "",
        tmpTreeData: {},
        defaultProps: {
          children: "children",
          label: "orgName",
          isLeaf: "isLeaf",
        },
        treeExpandData: [],
        dialogTitle: "授权组织",
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
      showCheckChoose(checkOrgIds, defOrgId, params) {
        this.params = params;
        if(checkOrgIds && checkOrgIds.length > 0){
          this.checkArr = checkOrgIds;
        }
        this.defId = defOrgId;
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

        const nodes = deepClone(this.$refs.orgTree.getCheckedNodes());
        let ret = {
          defOrg: null,
          orgList: [],
        };

        if(nodes && nodes.length > 0){
          ret.orgList = nodes;

          let flag = false;
          for(let i=0;i<nodes.length;i++){
            const node = nodes[i];
            if(node.def){
              ret.defOrg = node;
              flag = true;
              nodes.splice(i,1);
              break;
            }
          }
          if(!flag){
            this.$baseMessage("请设置默认项", "error");
            return;
          }
        }

        this.$emit("choose", ret, this.params);
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
                  // 默认项
                  if(id === this.defId){
                    node.data.def = true;
                  }
                  that.$refs.orgTree.setChecked(node, true);
                }
              });
            }
          });
        }
      },

      // 刷新节点
      freshNode(id){
        let node = this.$refs.orgTree.getNode(id);
        if(!node){
          return;
        }
        let flag = node.checked;
        // 刷新数据状态
        this.$refs.orgTree.setChecked(node, !flag);
        this.$refs.orgTree.setChecked(node, flag);
      },
      // 设置默认
      setDef(node, data){
        // 清除之前默认项
        const nodes = this.$refs.orgTree.getCheckedNodes();
        if(nodes && nodes.length > 0){
          for(let i=0;i<nodes.length;i++){
            const node = nodes[i];
            if(node.def){
              node.def = undefined;
              // 刷新数据状态
              this.freshNode(node.id);
              break;
            }
          }
        }

        // 设置自身状态
        data.def = true;
        // 刷新数据状态
        this.freshNode(data.id);
      },
      // 节点状态发生改变
      checkChange(currNode, currNodeFlag) {
        if (currNode) {
          // 如果取消勾选 则删除默认项
          if(!currNodeFlag){
            currNode.def = undefined;
            this.freshNode(currNode.id);
          }
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

            // 清空节点上默认项
            node.def = undefined;

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
<style lang="scss" scoped>
  .org-single-choose{
    .vab-custom-tree-node{
      width: 100%;

      .vab-tree-item{
        position: relative;
        width: 100%;

        .el-tag--small {
          height: 18px;
          line-height: 18px;
        }

        .set-def-btn {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0;
        }
      }
    }
  }
</style>
