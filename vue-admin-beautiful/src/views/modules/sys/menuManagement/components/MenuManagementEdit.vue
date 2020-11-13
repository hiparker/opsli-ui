<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px" class="menuManagement-edit-container">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编号" prop="menuCode">
            <el-input v-model="form.menuCode" autocomplete="off" ></el-input>
            <!-- 如果上级编号不为空 则出现提醒 -->
            <span v-if="base.parentCode !== '' ">
              添加下级只需要写本级编号，如：user
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="menuName">
            <el-input v-model="form.menuName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择"
                       default-first-option=""
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
        <el-col :span="12">
          <el-form-item label="排序" prop="sortNo">
            <el-input-number
                :min="1"
                :max="500"
                v-model="form.sortNo"
                autocomplete="off"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否隐藏" prop="hidden">
            <el-select v-model="form.hidden" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dict.no_yes"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路径" prop="url">
            <el-autocomplete
              class="inline-input"
              v-model="form.url"
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
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="组件路径" prop="component">
            <el-autocomplete
              class="inline-input"
              v-model="form.component"
              :fetch-suggestions="comQuerySearch"
              placeholder="请输入组件路径"
              style="width: 100%"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重定向" prop="redirect">
            <el-input v-model="form.redirect" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" autocomplete="off" readonly ></el-input>
            <el-button type="primary" icon="el-icon-search"
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

  </el-dialog>
</template>

<script>
  import {doInsert, doUpdate} from "@/api/menuManagement";
  import Icon from "@/components/opsli/icon/icon";

  import { isNull, isCode , isName } from "@/utils/validate";

  export default {
    name: "MenuManagementEdit",
    components: { Icon },
    data() {
      const validateCode = (rule, value, callback) => {
        if (isNull(value)) {
          callback(new Error("请输入编号"));
        } else if (!isCode(value)) {
          callback(new Error("编号只能为字母、数字或下划线"));
        } else {
          callback();
        }
      };
      const validateName = (rule, value, callback) => {
        if (isNull(value)) {
          callback(new Error("请输入名称"));
        } if (!isName(value)) {
          callback(new Error("名称格式不正确"));
        } else {
          callback();
        }
      };
      return {
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
        base: {
          parentCode: ""
        },
        form: {
          icon:"",
          // 设置默认值
          type: "1",
          hidden: "0",
          sortNo: 1,
          version: 0,
        },
        dict: {},
        rules: {
          menuCode: [
            { required: true, trigger: "blur", validator: validateCode },
          ],
          menuName: [
            { required: true, trigger: "blur", validator: validateName },
          ],
          sortNo: [{ required: true, trigger: "blur", message: "请输入排序" }],
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
          if(!isNull(row) && !isNull(row.parentName) && !isNull(row.parentId) && !isNull(row.parentCode)){
            // 设置上级Id
            this.form.parentId = row.parentId;
            this.base.parentCode = row.parentCode;
            this.title += "  - 上级名称 [ " + row.parentName +" ] - 上级编号 [" + this.base.parentCode + "]";
          }
        } else {
          this.title = "编辑";
          this.form = Object.assign({}, row);
        }
        this.dialogFormVisible = true;
      },
      close() {
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.base.parentCode = "";
        this.dialogFormVisible = false;
        this.$emit("fetchData");
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 修改
            if (!isNull(this.form.id)) {
              const { success, msg } = await doUpdate(this.form);
              if(success){
                this.$baseMessage(msg, "success");
              }
            } else {
              // 如果上级code不为空 则在新增是 拼上上级code
              if(!isNull(this.base.parentCode)){
                this.form.menuCode = this.base.parentCode + "_" + this.form.menuCode;
              }
              const { success, msg } = await doInsert(this.form);
              if(success){
                this.$baseMessage(msg, "success");
              }
            }

            await this.$emit("fetchData");
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
    },
  };
</script>

