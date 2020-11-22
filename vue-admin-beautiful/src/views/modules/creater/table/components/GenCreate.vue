<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="850px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="代码标题" prop="codeTitle">
            <el-input v-model="form.codeTitle" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标题简介" prop="codeTitleBrief">
            <el-input v-model="form.codeTitleBrief" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
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
        <el-col :span="12">
          <el-form-item label="模块名" prop="moduleName">
            <el-input v-model="form.moduleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="子模块名" prop="subModuleName">
            <el-input v-model="form.subModuleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="作者信息" prop="authorName">
            <el-input v-model="form.authorName" autocomplete="off"></el-input>
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
  import {getCreaterLogs, doCreate, doCreateJson} from "@/api/creater/tableManagement";
  import { isGeneralWithChinese, isLetter, isNotNull} from "@/utils/valiargs";
  import {title} from "@/config/settings";
  import { getAccessToken } from "@/utils/accessToken";
  const { baseURL, tokenName } = require("@/config/settings");


  export default {
    name: "GenCreate",
    data() {

      const validateName = (rule, value, callback) => {
        if (!isGeneralWithChinese(value)) {
          callback(new Error("只能是英文、数字、汉字或下划线"));
        } else {
          callback();
        }
      };

      const validateModule = (rule, value, callback) => {
        if (!isLetter(value)) {
          callback(new Error("只能是纯字母"));
        } else {
          callback();
        }
      };

      const validateSubModule = (rule, value, callback) => {
        if (isNotNull(value) && !isLetter(value)) {
          callback(new Error("只能是纯字母"));
        } else {
          callback();
        }
      };

      const validatePackageName = (rule, value, callback) => {
        const reg = /^(?!\.)(?!.*?\.$)[a-zA-Z.]+$/;
        if( !reg.test(value) ) {
          callback(new Error("包路径格式不正确"));
        } else {
          callback();
        }
      }


      return {
        form: {
          id: '',
          tableId: '',
          codeTitle: '',
          codeTitleBrief: '',
          packageName: '',
          moduleName: '',
          subModuleName: '',
          authorName: ''
        },
        dict: {},
        rules: {
          codeTitle: [
            { required: true, trigger: "blur", message: "请输入代码标题" },
            { required: true, trigger: "blur", validator: validateName },
          ],
          codeTitleBrief: [
            { required: true, trigger: "blur", message: "请输入代码标题简介" },
            { required: true, trigger: "blur", validator: validateName },
          ],
          packageName: [
            { required: true, trigger: "blur", message: "请输入包路径" },
            { required: true, trigger: "blur", validator: validatePackageName },
          ],
          moduleName: [
            { required: true, trigger: "blur", message: "请输入模块名" },
            { required: true, trigger: "blur", validator: validateModule },
          ],
          subModuleName: [
            { required: false, trigger: "blur", validator: validateSubModule },
          ],
          authorName: [
            { required: true, trigger: "blur", message: "请输入作者信息" },
            { required: true, trigger: "blur", validator: validateName },
          ],
        },
        title: "",
        dialogFormVisible: false,
        pathRestaurants: [
          { value: "org."},
          { value: "org.opsli"},
          { value: "org.opsli.modulars"},
          { value: "com."},
        ],
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      showEdit(tableId) {
        this.title = "生成代码";
        this.form.tableId = tableId;
        this.dialogFormVisible = true;
        this.fetchData();
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            this.$baseNotify(`正在生成，请耐心等待...`, `代码生成`);

            const paramsData = doCreateJson(this.form);
            paramsData.params[tokenName] = getAccessToken();

            //let url = window.URL.createObjectURL("https://www.baidu.com")
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = this.urlAddParams(baseURL+paramsData.url, paramsData.params);
            link.setAttribute('target', '_blank');

            document.body.appendChild(link);
            link.click();
            //释放URL对象所占资源
            //window.URL.revokeObjectURL(url)
            //用完即删
            document.body.removeChild(link);
            return;

            doCreate(this.form).then(data => {
                if (!data) {
                  this.$baseMessage(`下载内容为空`,'error');
                  return
                }

                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('target', '_blank');

                document.body.appendChild(link)
                link.click()
                //释放URL对象所占资源
                window.URL.revokeObjectURL(url)
                //用完即删
                document.body.removeChild(link)

                this.close();
            }).catch(err => {
              console.log('err: ', err)
            });
          }
        });
      },
      /**
       * 给URL追加参数
       * url
       * parameter 参数名
       * value  参数值
       */
      urlAddParams(url, params){
        if(isNotNull(url)) {
          let buf = url;
          for (let key in params) {
            let val = params[key];

            if (buf.indexOf("?") > -1) {  //已经有参数
              buf += "&";
            } else {
              buf += "?";
            }
            buf += key;
            buf += '=';
            buf += val;
          }
          return buf.toString();
        }
        return '';
      },
      async fetchData() {
        const { data } = await getCreaterLogs({tableId: this.form.tableId});
        if(isNotNull(data)){
          this.form = data;
        }
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
