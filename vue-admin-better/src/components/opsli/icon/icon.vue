<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :destroy-on-close="true"
    top="7vh"
    width="850px"
    center
    append-to-body
    @close="close"
  >
    <div class="adaptive-container">
      <div class="icon-container">
        <el-row :gutter="20">
          <el-col>
            <el-divider content-position="left">点击图标即可复制</el-divider>
          </el-col>
          <el-col>
            <el-form :inline="true" label-width="80px" @submit.native.prevent>
              <el-form-item label="图标名称">
                <el-input v-model="queryForm.title"></el-input>
              </el-form-item>
              <el-form-item label-width="0">
                <el-button
                  native-type="submit"
                  type="primary"
                  @click="queryData"
                >
                  搜索
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col
            v-for="(item, index) in queryIcon"
            :key="index"
            :xs="6"
            :sm="8"
            :md="3"
            :lg="2"
            :xl="2"
          >
            <el-card
              shadow="hover"
              style="cursor: pointer"
              @click.native="handleCopyIcon(index, $event)"
            >
              <vab-icon :icon="['fas', item]" />
            </el-card>
            <div class="icon-text">{{ item }}</div>
          </el-col>
          <el-col>
            <el-pagination
              background
              :current-page="queryForm.pageNo"
              :page-size="queryForm.pageSize"
              :page-sizes="[72, 144, 216, 288]"
              :pager-count="4"
              :layout="layout"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getIconList } from "@/router/mock/icon";

  export default {
    name: "AwesomeIcon",
    data() {
      return {
        copyText: "",
        layout: "prev, pager, next, jumper",
        total: 0,
        height: 0,
        selectRows: "",
        elementLoadingText: "正在加载...",
        queryIcon: [],
        queryForm: {
          pageNo: 1,
          pageSize: 48,
          title: "",
        },
        title: "图标选择",
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      showIcon() {
        this.fetchData();
        this.dialogFormVisible = true;
      },
      close() {
        this.copyText = "";
        this.queryIcon = [];
        this.queryForm = {
          pageNo: 1,
          pageSize: 48,
          title: "",
        };
        this.dialogFormVisible = false;
      },
      save() {
        this.$emit("icon", this.copyText);
        this.close();
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
        const { data, totalCount } = getIconList(this.queryForm);
        this.queryIcon = data;
        this.allIcon = data;
        this.total = totalCount;
      },
      hasClass(element, cls) {
        return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
      },
      handleCopyIcon(index, event) {
        if (!this.hasClass(event.target, "el-card__body")) {
          return;
        }
        let elCard = document.querySelectorAll(".el-card__body");
        for (let i = 0; i < elCard.length; i++) {
          elCard[i].parentNode.classList.remove("active");
        }
        event.target.parentNode.classList.add("active");
        this.copyText = this.queryIcon[index];
        // 暂时不需要复制
        //clip(copyText, event);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .icon-container {
    ::v-deep {
      .el-card__body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */

        svg:not(:root).svg-inline--fa {
          font-size: 35px;
          font-weight: bold;
          color: $base-color-gray;
          text-align: center;
          vertical-align: middle;
          pointer-events: none;
          cursor: pointer;
        }
      }
    }

    .icon-text {
      height: 30px;
      margin-top: -15px;
      overflow: hidden;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .active {
      border: 1px solid #4091f7 !important;
    }
  }
</style>
