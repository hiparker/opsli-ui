<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="105px" class="menuManagement-edit-container">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="上级菜单" prop="parentId">
            <el-input
              v-model="parentMenu.menuName"
              :readonly="true"
              autocomplete="off"
              @click.native="showParentMenu"
            ></el-input>
            <el-button type="primary" icon="el-icon-search"
                       class="input-btn-choose" @click="showParentMenu"></el-button>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="名称" prop="menuName">
            <el-input v-model="form.menuName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择"
                       default-first-option=""
                       @change="menuTypeChange"
                       style="width: 100%" >
              <el-option
                v-for="item in dict.menu_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="权限" prop="permissions">
            <el-input
              v-model="form.permissions"
              :disabled="!(form.type === '2')"
              autocomplete="off"></el-input>
              <span v-if="form.type === '2'">
                对应后端 @RequiresPermissions("xxx")
              </span>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="排序" prop="sortNo">
            <el-input-number
              :max="500"
              v-model="form.sortNo"
              autocomplete="off"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="隐藏" prop="hidden">
            <el-select
              v-model="form.hidden"
              :disabled="!(form.type === '1' || form.type === '3')"
              placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dict.no_yes"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="总是显示" prop="hidden">
            <el-select
              v-model="form.alwaysShow"
              :disabled="!(form.type === '1')"
              placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dict.no_yes"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="路径" prop="url">
            <el-autocomplete
              class="inline-input"
              v-model="form.url"
              :disabled="!(form.type === '1' || form.type === '3')"
              :fetch-suggestions="pathQuerySearch"
              placeholder="请输入路径"
              style="width: 100%"
            >
              <template slot-scope="{ item }">
                <span class="inline-input-container">
                  <div class="inline-input-value">{{ item.value }}</div>
                  <span class="inline-input-describe">{{ item.describe }}</span>
                </span>
              </template>

            </el-autocomplete>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="组件路径" prop="component">
            <el-autocomplete
              class="inline-input"
              v-model="form.component"
              :disabled="!(form.type === '1')"
              :fetch-suggestions="comQuerySearch"
              placeholder="请输入组件路径"
              style="width: 100%"
            ></el-autocomplete>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="重定向" prop="redirect">
            <el-input
              v-model="form.redirect"
              :disabled="!(form.type === '1')"
              autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="图标" prop="icon">
            <el-input
              v-model="form.icon"
              :disabled="!(form.type === '1' || form.type === '3')"
              autocomplete="off" ></el-input>
            <el-button type="primary" icon="el-icon-search"
                       :disabled="!(form.type === '1' || form.type === '3')"
                       class="input-btn-choose" @click="showIcon"></el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>

    <icon
      v-on:icon="closeIcon"
      ref="icon"
    ></icon>

    <menu-management-choose
      ref="menu-management-choose"
      @menuChoose="menuChoose"
    ></menu-management-choose>

  </el-dialog>
</template>

<script>
  import {doInsert, doUpdate, get, getTree} from "@/api/sys/menu/menuManagement";
  import Icon from "@/components/opsli/icon/icon";
  import MenuManagementChoose from "@/components/opsli/menu/MenuManagementChoose";
  import { deepClone } from "@/utils/clone";
  import { isNull} from "@/utils/validate";
  import { isGeneral , isGeneralWithChinese, getMsg} from "@/utils/valiargs";

  export default {
    name: "MenuManagementEdit",
    components: {MenuManagementChoose, Icon },
    data() {
      const validateCode = (rule, value, callback) => {
        if (!isGeneral(value)) {
          callback(new Error(getMsg("isGeneral")));
        } else {
          callback();
        }
      };
      const validateName = (rule, value, callback) => {
        if (!isGeneralWithChinese(value)) {
          callback(new Error(getMsg("isGeneralWithChinese")));
        } else {
          callback();
        }
      };
      return {
        formLoading: true,
        comRestaurants: [
          { value: "Layout"},
          { value: "EmptyLayout"},
        ],
        pathRestaurants: [
          { value: "http://", describe: "状态为外链时有效"},
          { value: "https://", describe: "状态为外链时有效"},
          { value: "http://${BASE_PATH}", describe: "状态为外链时有效"},
          { value: "https://${BASE_PATH}", describe: "状态为外链时有效"},
        ],
        parentMenu: {},
        genParentId: "",
        oldParentId: "",
        form: {
          icon:"",
          // 设置默认值
          type: "1",
          hidden: "0",
          alwaysShow: "0",
          parentId: "0",
          sortNo: 1,
          version: 0,
        },
        dict: {},
        rules: {
          menuName: [
            { required: true, trigger: "blur", message: "请输入名称" },
            { required: false, trigger: "blur", validator: validateName },
          ],
          permissions: [
            { required: false, trigger: "blur", validator: validateCode },
          ],
          sortNo: [{ required: true, trigger: "blur", message: "请输入排序" }],
          type: [{ required: true, trigger: "blur", message: "请选择是否类型" }],
          hidden: [{ required: true, trigger: "blur", message: "请选择是否隐藏" }],
          alwaysShow: [{ required: true, trigger: "blur", message: "请选择是否总是显示" }],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {
    },
    mounted() {
      // 如果不是每次开启时查询 在created中 有可能会短暂查不到
      this.dict.no_yes =  this.$getDictList("no_yes")
      this.dict.menu_type =  this.$getDictList("menu_type")
    },
    methods: {
      menuChoose(node){
        this.parentMenu = node;
        this.form.parentId = this.parentMenu.id;
      },
      showParentMenu(){
        this.$refs["menu-management-choose"].showMenuChoose();
      },
      showIcon(){
        this.$refs["icon"].showIcon();
      },
      // 选择完 icon 监听事件
      closeIcon(icon){
        this.form.icon = icon;
      },
      showEdit(row) {
        if (isNull(row) || isNull(row.id)) {
          this.title = "添加";
          // 如果上级菜单名称不为空 则显示到标题上
          if(row && !isNull(row.parentName) && !isNull(row.parentId)){
            // 设置上级Id
            this.form.parentId = row.parentId;
            this.genParentId = row.genParentId;
          }
        } else {
          this.title = "编辑";
          this.form = Object.assign({}, row);
        }
        this.oldParentId = this.form.parentId;
        this.dialogFormVisible = true;
        // 加载上级菜单数据
        this.fetchData();
      },
      close() {
        this.dialogFormVisible = false;

        // 刷新标签
        if(!isNull(this.oldParentId)){
          this.$emit("refreshNodeBy", this.oldParentId);
        }
        if(!isNull(this.genParentId)){
          this.$emit("refreshNodeBy", this.genParentId);
        }
        this.$emit("refreshNodeBy",this.form.parentId);

        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.oldParentId = "";
        this.genParentId = "";
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 字段数据
            let tmpForm = deepClone(this.form);

            // 修改
            if (!isNull(tmpForm.id)) {
              const { success, msg } = await doUpdate(tmpForm);
              if(success){
                this.$baseMessage(msg, "success");
              }
            } else {
              const { success, msg } = await doInsert(tmpForm);
              if(success){
                this.$baseMessage(msg, "success");
              }
            }

            // 刷新标签
            if(!isNull(this.oldParentId)){
              this.$emit("refreshNodeBy", this.oldParentId);
            }
            if(!isNull(this.genParentId)){
              this.$emit("refreshNodeBy", this.genParentId);
            }
            this.$emit("refreshNodeBy", this.form.parentId);

            this.close();
          } else {
            return false;
          }
        });
      },
      comQuerySearch(queryString, cb) {
        let restaurants = this.comRestaurants;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
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
      // 菜单类型更改
      menuTypeChange(type){
        const buttonType = "2";
        const outreachType = "3";
        // 外链
        if(outreachType === type){
          this.form.permissions = null;
        }
        // 按钮
        else if(buttonType === type){
          this.form.url = null;
          this.form.component = null;
          this.form.redirect = null;
          this.form.icon = null;
          this.form.alwaysShow = "0";
          this.form.hidden = "0";
        }
        // 外链
        else if(outreachType === type){
          this.form.component = null;
          this.form.redirect = null;
          this.form.permissions = null;
        }
      },
      // 获得菜单数据
      async fetchData() {
        this.formLoading = true;
        const { data } = await get({id: this.form.parentId});
        if(data){
          this.parentMenu = data;
        }

        setTimeout(() => {
          this.formLoading = false;
        }, 300);
      },
    },
  };
</script>

