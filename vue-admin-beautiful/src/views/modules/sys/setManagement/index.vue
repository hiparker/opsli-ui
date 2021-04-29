<template>
  <div v-loading="loadingData" class="setManagement-container">
    <el-tabs v-model="activeName" v-loading="loadingTabs">
      <el-tab-pane name="def">
        <span slot="label"><i class="el-icon-c-scale-to-original"></i> 系统默认</span>
        <el-form
          ref="defForm"
          :model="def.form"
          :rules="def.rules"
          label-width="125px"
        >

          <el-row>
            <el-col :span="12">
              <el-form-item label="默认重置密码" prop="def_pass">
                <el-input
                  v-model="def.form.def_pass"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="默认角色编号" prop="def_role">
                <el-input
                  v-model="def.form.def_role"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-button
            type="primary"
            style="margin-top: 50px"
            @click="save('defForm', def.form)"
          >
            保存
          </el-button>
        </el-form>
      </el-tab-pane>

      <el-tab-pane name="crypto">
        <span slot="label"><i class="el-icon-key"></i> 接口加密</span>
        <el-form
          ref="cryptoForm"
          :model="crypto.form"
          :rules="crypto.rules"
          label-width="125px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="非对称加密算法" prop="crypto_asymmetric">
                <el-select
                  v-model="crypto.form.crypto_asymmetric"
                  placeholder="请选择加密算法类型"
                  style="width: 100%"
                  @change="cryptoChange"
                >
                  <el-option
                    v-for="item in dict.crypto_asymmetric"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="padding-left: 30px">
              <el-button
                icon="el-icon-refresh"
                type="primary"
                @click="cryptoReset"
              >
                重置公私钥
              </el-button>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item label="公钥" prop="crypto_asymmetric_public_key">
                <el-input
                  v-model="crypto.form.crypto_asymmetric_public_key"
                  autocomplete="off"
                  readonly
                >
                  <el-button
                    slot="append"
                    @click="
                      handleClipboard(
                        crypto.form.crypto_asymmetric_public_key,
                        $event
                      )
                    "
                  >
                    复制
                  </el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item label="私钥" prop="crypto_asymmetric_private_key">
                <el-input
                  v-model="crypto.form.crypto_asymmetric_private_key"
                  autocomplete="off"
                  readonly
                >
                  <el-button
                    slot="append"
                    @click="
                      handleClipboard(
                        crypto.form.crypto_asymmetric_private_key,
                        $event
                      )
                    "
                  >
                    复制
                  </el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-button
            type="primary"
            style="margin-top: 50px"
            @click="save('cryptoForm', crypto.form)"
          >
            保存
          </el-button>
        </el-form>
      </el-tab-pane>


      <el-tab-pane name="email">
        <span slot="label"><i class="el-icon-message"></i> SMTP服务</span>
        <el-form
          ref="emailForm"
          :model="email.form"
          :rules="email.rules"
          label-width="125px"
        >

          <el-row>
            <el-col :span="12">
              <el-form-item label="SMTP地址" prop="email_smtp">
                <el-autocomplete
                  class="inline-input"
                  v-model="email.form.email_smtp"
                  :fetch-suggestions="smtpQuerySearch"
                  placeholder="请输入SMTP地址"
                  style="width: 100%"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="SMTP端口" prop="email_port">
                <el-input
                  v-model="email.form.email_port"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="开启SSL认证" prop="email_ssl_enable">
                <el-select
                  v-model="email.form.email_ssl_enable"
                  placeholder="请选择是否开启SSL认证" >
                  <el-option
                    v-for="item in dict.no_yes"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱账号" prop="email_account">
                <el-input
                  v-model="email.form.email_account"
                  autocomplete="off"
                  placeholder="xxxx@xx.com"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱账号密码" prop="email_password">
                <el-input
                  v-model="email.form.email_password"
                  autocomplete="off"
                  placeholder="某些邮箱需要为SMTP服务单独设置密码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="发件人" prop="email_addresser">
                <el-input
                  v-model="email.form.email_addresser"
                  autocomplete="off"
                  placeholder="发件人 xxxx@xx.com 或 测试<xxx.xx.com>"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-button
            type="primary"
            style="margin-top: 50px"
            @click="save('emailForm', email.form)"
          >
            保存
          </el-button>
        </el-form>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import clipboard from "@/utils/clipboard";
  import {
    getAllOptions,
    doCreateCrypto,
    doUpdateOptions,
  } from "@/api/set/setManagement";
  import { isNull } from "@/utils/validate";
  import {getMsg, isNumber} from "@/utils/valiargs";


  export default {
    name: "SetManagement",
    components: {
    },
    data() {

      const validate_optionCode_isNumber = (rule, value, callback) => {
        if (!isNumber(value)) {
          callback(new Error(getMsg("isNumber")));
        } else {
          callback();
        }
      };

      return {
        activeName: "def",
        dict: {},
        baseData: {},

        def: {
          form: {
            def_pass: "",
            def_role: "",
          },
          rules: {
            def_pass: [
              { required: true, trigger: "blur", message: "请输入默认密码" },
            ],
            def_role: [
              { required: true, trigger: "blur", message: "请输入默认角色编号" },
            ]
          },
        },
        crypto: {
          form: {
            crypto_asymmetric: "",
            crypto_asymmetric_public_key: "",
            crypto_asymmetric_private_key: "",
          },
          rules: {
            crypto_asymmetric: [
              { required: true, trigger: "blur", message: "请选择类型" },
            ],
            crypto_asymmetric_public_key: [
              { required: true, trigger: "blur", message: "请重置公钥" },
            ],
            crypto_asymmetric_private_key: [
              { required: true, trigger: "blur", message: "请重置私钥" },
            ],
          },
        },

        email: {
          form: {
            email_smtp: "",
            email_port: "",
            email_ssl_enable: "",
            email_account: "",
            email_password: "",
            email_addresser: "",
          },
          rules: {
            email_smtp: [
              { required: true, trigger: "change", message: "请输入SMTP地址" },
            ],
            email_port: [
              { required: true, trigger: "blur", message: "请输入SMTP端口" },
              { required: false, trigger: "blur", validator: validate_optionCode_isNumber },
            ],
            email_account: [
              { required: true, trigger: "blur", message: "请输入邮箱账号" },
            ],
            email_password: [
              { required: true, trigger: "blur", message: "请输入邮箱密码" },
            ],
            email_addresser: [
              { required: true, trigger: "blur", message: "请输入发件人" },
            ]
          },
        },
        smtpRestaurants: [
          { value: "smtp.aliyun.com"},
          { value: "smtp.gmail.com"},
          { value: "smtp.sina.com.cn"},
          { value: "smtp.tom.com"},
          { value: "smtp.163.com"},
          { value: "smtp.126.com"},
          { value: "smtp.mail.yahoo.com"},
          { value: "smtp.mail.yahoo.com.cn"},
          { value: "smtp.foxmail.com"},
          { value: "smtp.foxmail.com.cn"},
          { value: "smtp.qq.com"},
          { value: "smtp.sohu.com"},
          { value: "smtp.live.com"},
          { value: "smtp.139.com"},
          { value: "smtp.china.com"},
        ],
        loadingData: true,
        loadingTabs: false,
      };
    },
    created() {
      // 加载字典
      this.dict.no_yes = this.$getDictList("no_yes");
      this.dict.crypto_asymmetric = this.$getDictList("crypto_asymmetric");
      this.fetchData();
    },
    methods: {
      // 接口加密下拉框改动
      cryptoChange() {
        // 清空公私钥
        this.crypto.form.crypto_asymmetric_public_key = "";
        this.crypto.form.crypto_asymmetric_private_key = "";
      },
      // 非对称加密重置
      async cryptoReset() {
        const { success, data } = await doCreateCrypto(
          this.crypto.form.crypto_asymmetric
        );
        if (success && !isNull(data)) {
          this.crypto.form.crypto_asymmetric_public_key = data.publicKey;
          this.crypto.form.crypto_asymmetric_private_key = data.privateKey;
          this.$baseMessage("已重置公私钥，保存后生效", "warning");
        }
      },

      // 保存
      async save(refs, data) {
        this.$refs[refs].validate(async (valid) => {
          if (valid) {
            this.loadingTabs = true;
            const { success, msg } = await doUpdateOptions(data).catch(() => {
              setTimeout(() => {
                this.loadingTabs = false;
              }, 300);
            });
            if (success) {
              this.$baseMessage(msg, "success");
              setTimeout(() => {
                this.loadingTabs = false;
              }, 300);
            }
          } else {
            return false;
          }
        });
      },

      // ================================

      smtpQuerySearch(queryString, cb) {
        let restaurants = this.smtpRestaurants;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      // 复制
      handleClipboard(text, event) {
        clipboard(text, event);
      },
      async fetchData() {
        this.loadingData = true;
        const { success, data } = await getAllOptions(this.queryForm);
        if (success && !isNull(data)) {
          this.baseData = data;

          // 系统默认配置
          this.def.form.def_pass = !isNull(this.baseData.def_pass)?
            this.baseData.def_pass.optionValue:"";
          this.def.form.def_role = !isNull(this.baseData.def_role)?
            this.baseData.def_role.optionValue:"";


          // 接口加密数据
          this.crypto.form.crypto_asymmetric = !isNull(this.baseData.crypto_asymmetric)?
            this.baseData.crypto_asymmetric.optionValue:"";
          this.crypto.form.crypto_asymmetric_public_key = !isNull(this.baseData.crypto_asymmetric_public_key)?
            this.baseData.crypto_asymmetric_public_key.optionValue:"";
          this.crypto.form.crypto_asymmetric_private_key = !isNull(this.baseData.crypto_asymmetric_private_key)?
            this.baseData.crypto_asymmetric_private_key.optionValue:"";



          // 邮箱配置
          this.email.form.email_smtp = !isNull(this.baseData.email_smtp)?
            this.baseData.email_smtp.optionValue:"";
          this.email.form.email_port = !isNull(this.baseData.email_port)?
            this.baseData.email_port.optionValue:"";
          this.email.form.email_ssl_enable = !isNull(this.baseData.email_ssl_enable)?
            this.baseData.email_ssl_enable.optionValue:"1";
          this.email.form.email_account = !isNull(this.baseData.email_account)?
            this.baseData.email_account.optionValue:"";
          this.email.form.email_password = !isNull(this.baseData.email_password)?
            this.baseData.email_password.optionValue:"";
          this.email.form.email_addresser = !isNull(this.baseData.email_addresser)?
            this.baseData.email_addresser.optionValue:"";



          setTimeout(() => {
            this.loadingData = false;
          }, 300);
        }
      },
    },
  };
</script>
