<template>
  <el-drawer
    size="45%"
    :visible.sync="dictDetailVisible"
    :close-on-click-modal="false"
    :before-close="close"
    class="dictDetail-container"
  >
    <el-col slot="title" class="container-title">
      字典类型 -
      <el-tag type="info" class="container-title-tag">{{title}}</el-tag>
    </el-col>

    <el-row class="container" >
      <!-- 字典明细表 -->
      <el-col>
        <vab-query-form>
          <vab-query-form-left-panel :span="4">

            <el-button
              v-if="$perms('system_dict_insert')"
              icon="el-icon-plus"
              type="primary"
              @click="handleInsert"
            > 添加 </el-button>

          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="20">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>

              <el-form-item>
                <el-input
                  v-model.trim="queryForm.dictName_LIKE"
                  placeholder="字典名称"
                  clearable
                />
              </el-form-item>


              <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="dictTable"
          v-loading="listLoading"
          :data="list"
          :element-loading-text="elementLoadingText"
        >

          <el-table-column
            show-overflow-tooltip
            prop="dictName"
            label="字典名称"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="dictValue"
            label="字典值"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="sortNo"
            label="排序"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izLock"
            label="是否内置"
          >
            <template slot-scope="scope">
              <span>
                <el-tag v-if="scope.row.izLock === '0' " type="success">
                  {{ $getDictNameByValue('no_yes', scope.row.izLock) }}
                </el-tag>
                <el-tag v-if="scope.row.izLock === '1' " type="info">
                  {{ $getDictNameByValue('no_yes', scope.row.izLock) }}
                </el-tag>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            show-overflow-tooltip
            label="操作"
            width="130"
            v-if="$perms('system_dict_update') || $perms('system_dict_delete')"
          >
            <template v-slot="scope">
              <el-button
                v-if="$perms('system_dict_update')"
                type="text"
                @click="handleUpdate(scope.row)"
              > 编辑 </el-button>

              <el-divider direction="vertical"></el-divider>

              <el-button
                v-if="$perms('system_dict_delete')"
                type="text"
                @click="handleDelete(scope.row)"
              > 删除 </el-button>
            </template>

          </el-table-column>

        </el-table>

        <el-pagination
          background
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :layout="layout"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>

    <dict-detail-edit ref="dict-detail-edit" @fetchData="fetchData" ></dict-detail-edit>

  </el-drawer>
</template>

<script>
  import { getList, doDelete} from "@/api/system/dict/dictDetailManagement";
  import { isNull } from "@/utils/validate";
  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo } from "@/api/user";
  import DictDetailEdit from "./dictDetailEdit";

  export default {
    name: "DictManagement",
    components: { DictDetailEdit },
    data() {
      return {
        title: "",
        dictDetailVisible: false,
        userInfo: null,
        izLock: "0",
        list: null,
        listLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        elementLoadingText: "正在加载...",
        dictType: {
          typeId: "",
          typeCode: "",
        },
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          typeId_EQ: "",
          dictName_LIKE: "",
          sortNo_ORDER: "ASC",
        },
      };
    },
    created() {
      // 获得用户数据
      this.getUser();
    },
    methods: {
      show(row){
        this.dictDetailVisible = true;
        this.dictType.typeId = row.id;
        this.dictType.typeCode = row.typeCode;
        this.queryForm.typeId_EQ = row.id;
        this.title = row.typeName;
        this.izLock = row.izLock;
        this.fetchData();
      },
      close(){
        this.list = null;
        this.title = "";
        this.queryForm.typeId_EQ = "";
        this.queryForm.dictName_LIKE = "";
        this.dictDetailVisible = false;
      },
      handleInsert() {
        // 如果 用户信息为空 或者 不是超级管理员 则无法更改 内置数据
        if(isNull(this.userInfo) || !this.userInfo.izSuperAdmin){
          if(this.izLock === "1"){
            this.$baseMessage("内置数据只有超级管理员可以更改", "error");
            return;
          }
        }

        this.$refs["dict-detail-edit"].showInsert(this.dictType);
      },
      handleUpdate(row) {
        if (row.id) {
          this.$refs["dict-detail-edit"].showUpdate(row);
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm("你确定要删除当前项吗", null, async () => {
            const { msg } = await doDelete({ id: row.id });
            this.$baseMessage(msg, "success");
            await this.fetchData();
          });
        }
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
        const { data } = await getList(this.queryForm);
        if(!isNull(data)){
          this.list = data.rows;
          this.total = data.total;
        }

        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },
      // 获取用户数据
      async getUser() {
        this.listLoading = true;
        let accessToken = getAccessToken();
        const { data } = await getUserInfo(accessToken);
        if(!isNull(data)){
          this.userInfo = Object.assign({}, data);
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
.dictDetail-container {
  .container {
    padding-left: 15px;
  }
  .container-title{
    font-size: 16px;
    font-weight: bold;
  }

  .container-title-tag{
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
