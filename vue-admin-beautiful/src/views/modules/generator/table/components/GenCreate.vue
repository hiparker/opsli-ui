<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px" class="gen-create">

      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="代码标题" prop="codeTitle">
            <el-input v-model="form.codeTitle" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="标题简介" prop="codeTitleBrief">
            <el-input v-model="form.codeTitleBrief" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="包路径" prop="packageName">
            <el-autocomplete
              class="inline-input"
              v-model="form.packageName"
              autocomplete="off"
              :fetch-suggestions="pathQuerySearch"
              style="width: 100%"
            >
              <template slot-scope="{ item }">
                <span class="inline-input-container">
                  <div class="inline-input-value">{{ item.value }}</div>
                </span>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="模块名" prop="moduleName">
            <el-input v-model="form.moduleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="子模块名" prop="subModuleName">
            <el-input v-model="form.subModuleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="作者信息" prop="authorName">
            <el-input v-model="form.authorName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="选择模板" prop="templateId">
            <el-select v-model="form.templateId" placeholder="请选择模板"
                       style="width: 100%">
              <el-option
                v-for="item in templateList"
                :key="item.id"
                :label="item.tempName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getGenLogs, doCreate} from "@/api/generator/tableManagement";
  import { getList } from "@/api/generator/template/GenTemplateManagement";
  import { urlAddArgsByData } from "@/utils";
  import { isNotNull} from "@/utils/valiargs";
  import { validatorRule } from "@/utils/validateRlue";
  import {title} from "@/config/settings";
  import { getAccessToken } from "@/utils/accessToken";
  const { baseURL, tokenName } = require("@/config/settings");


  export default {
    name: "GenCreate",
    data() {
      const validatePackageName = (rule, value, callback) => {
        const reg = /^(?!\.)(?!.*?\.$)[a-zA-Z.]+$/;
        if( !reg.test(value) ) {
          callback(new Error("包路径格式不正确"));
        } else {
          callback();
        }
      }


      return {
        templateList: [],
        form: {
          id: '',
          tableId: '',
          tableType: '',
          codeTitle: '',
          codeTitleBrief: '',
          packageName: '',
          moduleName: '',
          subModuleName: '',
          authorName: '',
          templateId: '',
        },
        dict: {},
        rules: {
          codeTitle: [
            { required: true, trigger: "blur", message: "请输入代码标题" },
            { required: true, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
          ],
          codeTitleBrief: [
            { required: true, trigger: "blur", message: "请输入代码标题简介" },
            { required: true, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
          ],
          packageName: [
            { required: true, trigger: "blur", message: "请输入包路径" },
            { required: true, trigger: "blur", validator: validatePackageName },
          ],
          moduleName: [
            { required: true, trigger: "blur", message: "请输入模块名" },
            { required: true, trigger: "blur", validator: validatorRule.IS_LETTER },
          ],
          subModuleName: [
            { required: false, trigger: "blur", validator: validatorRule.IS_LETTER },
          ],
          authorName: [
            { required: true, trigger: "blur", message: "请输入作者信息" },
            { required: true, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
          ],
          templateId: [
            { required: true, trigger: "change", message: "请选择模板" },
          ],
        },
        title: "",
        target: null,
        dialogFormVisible: false,
        elementLoadingObj: null,
        pathRestaurants: [
          { value: "org."},
          { value: "org.opsli"},
          { value: "org.opsli.modulars"},
          { value: "com."},
        ],
      };
    },
    methods: {
      showEdit(row) {
        if(row){
          this.title = "生成代码";
          this.form.tableId = row.id;
          this.form.tableType = row.tableType;
          this.dialogFormVisible = true;
          this.fetchData();
        }
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.target = null;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            this.$baseNotify(`正在生成，请耐心等待...`, `代码生成`);
            doCreate(this.form);
          }
        });
      },
      async fetchData() {
        this.$nextTick(async () => {
          // loading 对象
          this.target = document.querySelector(".gen-create");

          if(this.elementLoadingObj){
            this.elementLoadingObj.close();
          }
          // 执行表格刷新 （需要彻底情况并延迟 才会生效）
          this.elementLoadingObj = this.$basePartLoading(this.target, null, this.elementLoadingText);

          {
            const { data } = await getGenLogs({tableId: this.form.tableId});
            if(isNotNull(data)){
              this.form = data;
            }
          }

          {
            const { data } = await getList({tableType_EQ: this.form.tableType});
            if(isNotNull(data)){
              this.templateList = data.rows;
            }
          }

          setTimeout(() => {
            if(this.elementLoadingObj){
              this.elementLoadingObj.close();
            }
          }, 300);
        });


      },
      pathQuerySearch(queryString, cb) {
        let restaurants = this.pathRestaurants;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
    },
  };
</script>
