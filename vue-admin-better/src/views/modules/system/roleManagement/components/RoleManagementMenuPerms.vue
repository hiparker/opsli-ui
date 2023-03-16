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
    <el-col class="role-perms">
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
  import { getMenuAndPermsTree } from "@/api/system/menu/menuManagement";
  import { doGetPerms, doSetPerms } from "@/api/system/role/roleManagement";

  export default {
    name: "RoleManagementMenuPerms",
    data() {
      return {
        activeName: "",
        roleId: "",
        permsData: [],
        filterText: "",
        defaultProps: {
          children: "children",
          label: "name",
        },
        dialogTitle: "设置权限",
        dialogVisible: false,
        elementLoadingObj: null
      };
    },
    watch: {
      filterText(val) {
        this.$refs.permsTree.filter(val);
      },
    },
    methods: {
      loading(){
        this.$nextTick(async () => {
          if(this.elementLoadingObj){
            this.elementLoadingObj.close();
          }
          // 执行表格刷新 （需要彻底情况并延迟 才会生效）
          this.elementLoadingObj = this.$basePartLoading(this.target, null, this.elementLoadingText);
        });
      },
      unLoading() {
        this.$nextTick(() => {
          if(this.elementLoadingObj){
            this.elementLoadingObj.close();
          }
        });
      },
      showPerms(row, activeName) {
        this.dialogVisible = true;
        this.roleId = row.id;
        this.activeName = activeName;
        // 加载数据
        this.fetchData();
      },
      close() {
        this.dialogVisible = false;
        this.roleId = "";
        this.activeName = "";
        this.permsData = [];
        this.defaultCheckedKeys = [];
      },
      // 保存权限
      async save() {
        // 获得当前所有选中节点ID
        let nodeIds = this.$refs.permsTree.getCheckedKeys().concat(
          this.$refs.permsTree.getHalfCheckedKeys());
        const {msg} = await doSetPerms({
          roleId: this.roleId,
          permsIds: this.unique(nodeIds)
        });
        this.$baseMessage(msg, "success");
        this.close()
      },
      // 获得菜单数据
      async fetchData() {
        let that = this;
        this.$nextTick(async () => {
          // loading 对象
          that.target = document.querySelector(".role-perms");
          that.loading();
          that.listLoading = true;

          const { data } = await getMenuAndPermsTree({
            label: this.activeName
          });
          const checkedData = await doGetPerms({
            roleId: this.roleId
          });
          that.permsData = data;

          // 设置选中数据 原理 选中叶子节点 自动勾选父节点
          if(!isNull(checkedData) && !isNull(checkedData.data)){
            that.$nextTick(() => {
              const checkArray = checkedData.data;
              if(checkArray != null && checkArray.length > 0){
                checkArray.forEach((id) => {
                  let node = that.$refs.permsTree.getNode(id);
                  if (node && node.isLeaf) {
                    that.$refs.permsTree.setChecked(node, true);
                  }
                });
              }
            })
          }

          setTimeout(() => {
            that.unLoading();
          }, 200)
        });
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
