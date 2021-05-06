<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    width="450px"
    center
    append-to-body
    class="org-grid-select"
    @close="close"
  >
    <el-col>
      <el-input v-model="filterText" placeholder="输入关键字过滤" />
      <el-tree
        ref="orgTree"
        :data="orgData"
        :default-checked-keys="defaultCheckedKeys"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :check-on-click-node="true"
        :check-strictly="false"
        :props="defaultProps"
        class="vab-filter-tree"
        node-key="id"
        default-expand-all
      >
        <span slot-scope="{ node, data }" class="vab-custom-tree-node">
          <span class="vab-tree-item">
            {{ node.label }}
            <el-tag v-if="data.orgType === '1'">
              {{ $getDictNameByValue("org_type", data.orgType) }}
            </el-tag>
            <el-tag v-if="data.orgType === '2'" type="warning">
              {{ $getDictNameByValue("org_type", data.orgType) }}
            </el-tag>
            <el-tag v-if="data.orgType === '3'" type="success">
              {{ $getDictNameByValue("org_type", data.orgType) }}
            </el-tag>
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
  import { isNull } from "@/utils/validate";
  import { getGridTree } from "@/api/sys/org/orgManagement";

  /**
   * 组织结构类型
   *
   * 1  公司
   * 2  部门
   * 3  岗位
   *
   * 注：必须有回调函数 resultNode
   * <org ref="org" @resultNode="方法" ></org>
   *
   */
  export default {
    name: "OrgSelect",
    data() {
      return {
        orgType: "",
        parentId: "",
        orgData: [],
        filterText: "",
        dict: {},
        defaultCheckedKeys: [],
        defaultProps: {
          children: "children",
          label: "orgName",
        },
        dialogTitle: "",
        dialogVisible: false,
      };
    },
    watch: {
      filterText(val) {
        this.$refs["orgTree"].filter(val);
      },
    },
    mounted() {
      this.dict.org_type = this.$getDictList("org_type");
    },
    methods: {
      showOrg(row) {
        if (isNull(row) || isNull(row.orgType)) {
          this.$baseMessage("未设置组织机构类型", "error");
          return;
        }
        if (isNull(row) || isNull(row.parentId)) {
          this.$baseMessage("未设置上级ID", "error");
          return;
        }

        this.parentId = row.parentId;
        this.orgType = row.orgType;
        this.dialogTitle =
          "选择" + this.$getDictNameByValue("org_type", this.orgType);

        // 加载数据
        this.fetchData();
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.dialogTitle = "";
        this.orgType = "";
        this.orgData = [];
        this.defaultCheckedKeys = [];
      },
      // 保存权限
      async save() {
        // 获得当前所有选中节点ID
        let node = this.$refs["orgTree"].getCurrentNode();
        if (isNull(node) || this.orgType !== node.orgType) {
          let title = this.$getDictNameByValue("org_type", this.orgType);
          this.$baseMessage("请选择" + title, "error");
          return;
        }

        await this.$emit("resultNode", node);
        this.close();
      },
      // 获得菜单数据
      async fetchData() {
        this.listLoading = true;
        const { data } = await getGridTree({ parentId: this.parentId });
        this.orgData = data;
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
