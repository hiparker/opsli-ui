<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="650px"
    @close="close"
  >

    <div class="adaptive-container">

      <el-table
        v-loading="listLoading"
        :data="list"
        :element-loading-text="elementLoadingText"
        @selection-change="setSelectRows"
      >

        <el-table-column show-overflow-tooltip type="selection"></el-table-column>

        <el-table-column show-overflow-tooltip label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="tableName"
          label="表名称"
          width="240"
        ></el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="tableComments"
          label="描述"
        ></el-table-column>

      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { doImportTables, getTables} from "@/api/generator/tableManagement";
  import { isNull } from "@/utils/validate";

  export default {
    name: "showDatabaseTables",
    components: { },
    data() {
      return {
        title: "",
        dialogFormVisible: false,
        list: null,
        listLoading: true,
        selectRows: "",
        elementLoadingText: "正在加载...",
      };
    },
    created() {

    },
    methods: {
      show() {
        this.title = "导入数据库表";
        this.fetchData();
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.title = "";
        this.list = [];
      },
      async save(){
        if (this.selectRows.length > 0) {
          const tableNames = this.selectRows.map((item) => item.tableName).join(",");
          const { msg } = await doImportTables({tableNames: tableNames});
          this.$baseMessage(msg, "success");
          this.$emit("fetchData");
          this.close();

        } else {
          this.$baseMessage("未选中任何行", "error");
          return false;
        }
      },
      setSelectRows(val) {
        this.selectRows = val;
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.fetchData();
      },
      queryData() {
        this.queryForm.pageNo = 1;
        this.fetchData();
      },
      async fetchData() {
        this.listLoading = true;
        const { data } = await getTables(this.queryForm);
        if(!isNull(data)){
          this.list = data;
        }

        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },
    },
  };
</script>
