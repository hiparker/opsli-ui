<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    width="350px"
    @close="close"
    class="role-management-perms"
  >
    <el-col>
      <el-input v-model="filterText" placeholder="输入关键字过滤" />
      <el-tree
        ref="permsTree"
        :data="permsData"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :check-on-click-node="true"
        :check-strictly="false"
        :props="defaultProps"
        class="vab-filter-tree"
        node-key="id"
        default-expand-all
        show-checkbox
      >
      <span slot-scope="{ node, data }" class="vab-custom-tree-node">
        <span class="vab-tree-item">
          <!-- 菜单 -->
          <vab-icon v-if="data.type === '1' " :icon="['fas', 'th-large']"> </vab-icon>
          <!-- 按钮 -->
          <vab-icon v-if="data.type === '2' " :icon="['fas', 'cogs']"> </vab-icon>
          <!-- 链接 -->
          <vab-icon v-if="data.type === '3' " :icon="['fas', 'link']"> </vab-icon>
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
  import { isNull} from "@/utils/validate";
  import { getMenuAndPermsTree } from "@/api/menuManagement";
  import { doGetPerms, doSetPerms } from "@/api/roleManagement";

  export default {
    name: "RoleManagementPerms",
    data() {
      return {
        roleId: "",
        permsData: [],
        filterText: "",
        defaultProps: {
          children: "children",
          label: "name",
        },
        dialogTitle: "设置权限",
        dialogVisible: false,
      };
    },
    watch: {
      filterText(val) {
        this.$refs.permsTree.filter(val);
      },
    },
    methods: {
      showPerms(row) {
        this.roleId = row.id;
        // 加载数据
        this.fetchData();
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.roleId = "";
        this.permsData = [];
        this.defaultCheckedKeys = [];
      },
      // 保存权限
      async save() {
        // 获得当前所有选中节点ID
        let nodeIds = this.$refs.permsTree.getCheckedKeys().concat(
          this.$refs.permsTree.getHalfCheckedKeys());
        const {success, msg} = await doSetPerms({
          roleId: this.roleId,
          permsIds: this.unique(nodeIds)
        });
        if (success) {
          this.$baseMessage(msg, "success");
        }
        this.close()
      },
      // 获得菜单数据
      async fetchData() {
        let that = this;

        this.listLoading = true;
        const { data } = await getMenuAndPermsTree();
        const checkedData = await doGetPerms({roleId: this.roleId})
        this.permsData = data;

        // 设置选中数据 原理 选中叶子节点 自动勾选父节点
        if(!isNull(checkedData) && !isNull(checkedData.data)){
          that.$nextTick(() => {
            const checkArray = checkedData.data;
            if(checkArray != null && checkArray.length > 0){
              checkArray.forEach((id) => {
                let node = that.$refs.permsTree.getNode(id);
                if (node.isLeaf) {
                  that.$refs.permsTree.setChecked(node, true);
                }
              });
            }
          })
        }

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
