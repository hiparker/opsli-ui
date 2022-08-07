<template>
  <div v-loading="loadingData" class="setManagement-container">
    <el-tabs v-model="activeName" v-loading="loadingTabs" type="card">
      <el-tab-pane name="def" class="tab-pane">
        <span slot="label"><i class="el-icon-c-scale-to-original"></i> 系统默认</span>
        <el-form
          ref="defForm"
          :model="def.form"
          :rules="def.rules"
          label-width="125px"
        >

          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="默认重置密码" prop="def_pass">
                <el-input
                  v-model="def.form.def_pass"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="默认角色编号" prop="def_role">
                <el-input
                  v-model="def.form.def_role"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item label="文件存储位置" prop="storage_type">
                <el-select
                  v-model="def.form.storage_type"
                  placeholder="请选择文件存储位置"
                >
                  <el-option
                    v-for="item in dict.storage_type"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
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

      <el-tab-pane name="crypto" class="tab-pane">
        <span slot="label"><i class="el-icon-key"></i> 接口加密</span>
        <el-form
          ref="cryptoForm"
          :model="crypto.form"
          :rules="crypto.rules"
          label-width="125px"
        >

          <el-row :gutter="10" class="hidden-md-and-up">


            <el-col :xs="24" :sm="24">
              <el-form-item label="操作" prop="crypto_asymmetric">
                <el-button
                  icon="el-icon-refresh"
                  type="primary"
                  @click="cryptoReset"
                >
                  重置公私钥
                </el-button>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24">
              <el-form-item label="加密算法" prop="crypto_asymmetric">
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
          </el-row>

          <el-row :gutter="10" class="hidden-sm-and-down">
            <el-col :md="12" :lg="5" :xl="5">
              <el-form-item label="加密算法" prop="crypto_asymmetric">
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

            <el-col :md="12" :lg="6" :xl="6">
              <el-button
                icon="el-icon-refresh"
                type="primary"
                @click="cryptoReset"
              >
                重置公私钥
              </el-button>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
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

          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
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


      <el-tab-pane name="email" class="tab-pane" >
        <span slot="label"><i class="el-icon-message"></i> SMTP服务</span>

        <el-tabs v-model="smtpActiveName">
          <el-tab-pane label="发信设置" name="smtp-config">
            <el-form
              ref="emailForm"
              :model="email.form"
              :rules="email.rules"
              label-width="125px"
            >

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
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

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="SMTP端口" prop="email_port">
                    <el-input
                      v-model="email.form.email_port"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
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

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="邮箱账号" prop="email_account">
                    <el-input
                      v-model="email.form.email_account"
                      autocomplete="off"
                      placeholder="*****脱敏存储******"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="邮箱密码" prop="email_password">
                    <el-input
                      v-model="email.form.email_password"
                      type="password"
                      autocomplete="off"
                      placeholder="*****脱敏存储******"
                      show-password
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
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

          <el-tab-pane label="发信测试" name="smtp-test">
            <el-form ref="smtp-test-form" :model="emailTest.form" :rules="emailTest.rules" label-width="105px">
              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="收件人" prop="to">
                    <el-input v-model="emailTest.form.to"
                              autocomplete="off"
                              placeholder="xxxx@xx.com"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="主题" prop="subject">
                    <el-input v-model="emailTest.form.subject"
                              autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="内容" prop="content">
                    <el-input type="textarea"
                              v-model="emailTest.form.content"
                              autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-button
                type="primary"
                style="margin-top: 50px"
                @click="smtpTestSend"
              >
                发送邮件
              </el-button>

            </el-form>
          </el-tab-pane>
        </el-tabs>


      </el-tab-pane>

      <el-tab-pane name="storage" class="tab-pane">
        <span slot="label">
          <i class="el-icon-folder-opened"></i>
          OSS存储服务
        </span>

        <el-tabs v-model="storageActiveName">
          <el-tab-pane label="本地配置" name="local-config">
            <el-form
              ref="storageLocalForm"
              :model="storage.storage_local.form"
              :rules="storage.storage_local.rules"
              label-width="125px"
            >
              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="域名" prop="storage_local_domain">
                    <el-input
                      v-model="storage.storage_local.form.storage_local_domain"
                      autocomplete="off"
                      placeholder="本地需要到代理名 如 http:xxx.com/opsli-boot"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="路径前缀" prop="storage_local_path_prefix">
                    <el-input
                      v-model="
                        storage.storage_local.form.storage_local_path_prefix
                      "
                      autocomplete="off"
                      placeholder="路径前缀默认为空"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-button
                type="primary"
                style="margin-top: 50px"
                @click="save('storageLocalForm', storage.storage_local.form)"
              >
                保存
              </el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="又拍云配置" name="upyun-config">
            <el-form
              ref="storageUpYunForm"
              :model="storage.storage_upyun.form"
              :rules="storage.storage_upyun.rules"
              label-width="125px"
            >
              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="域名" prop="storage_upyun_domain">
                    <el-input
                      v-model="storage.storage_upyun.form.storage_upyun_domain"
                      autocomplete="off"
                      placeholder="如 http:xxx.com"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="路径前缀" prop="storage_upyun_path_prefix">
                    <el-input
                      v-model="
                        storage.storage_upyun.form.storage_upyun_path_prefix
                      "
                      autocomplete="off"
                      placeholder="路径前缀默认为空"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="仓库名" prop="storage_upyun_bucket_name">
                    <el-input
                      v-model="
                        storage.storage_upyun.form.storage_upyun_bucket_name
                      "
                      autocomplete="off"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="用户名" prop="storage_upyun_username">
                    <el-input
                      v-model="
                        storage.storage_upyun.form.storage_upyun_username
                      "
                      autocomplete="off"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="用户名密码" prop="storage_upyun_password">
                    <el-input
                      v-model="
                        storage.storage_upyun.form.storage_upyun_password
                      "
                      autocomplete="off"
                      placeholder="*****脱敏存储******"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-button
                type="primary"
                style="margin-top: 50px"
                @click="save('storageUpYunForm', storage.storage_upyun.form)"
              >
                保存
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <el-tab-pane name="sms" class="tab-pane">
        <span slot="label">
          <i class="el-icon-folder-opened"></i>
          短信服务
        </span>

        <el-tabs v-model="smsActiveName">
          <el-tab-pane label="阿里云短信" name="sms-aliyun-config">
            <el-form
              ref="smsAliyunForm"
              :model="sms.aliyun.form"
              :rules="sms.aliyun.rules"
              label-width="125px"
            >
              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="AccessKey" prop="sms_aliyun_access_key">
                    <el-input
                      v-model="sms.aliyun.form.sms_aliyun_access_key"
                      autocomplete="off"
                      placeholder="AccessKey"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="AccessKeySecret" prop="sms_aliyun_access_key_secret">
                    <el-input
                      v-model="sms.aliyun.form.sms_aliyun_access_key_secret"
                      autocomplete="off"
                      placeholder="******脱敏存储******"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="验证码模版" prop="sms_aliyun_captcha_template_code">
                    <el-input
                      v-model="sms.aliyun.form.sms_aliyun_captcha_template_code"
                      autocomplete="off"
                      placeholder="请输入验证码短信模版"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
                  <el-form-item label="验证码签名" prop="sms_aliyun_captcha_sign">
                    <el-input
                      v-model="sms.aliyun.form.sms_aliyun_captcha_sign"
                      autocomplete="off"
                      placeholder="请输入验证码签名"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-button
                type="primary"
                style="margin-top: 50px"
                @click="save('smsAliyunForm', sms.aliyun.form)"
              >
                保存
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
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
    doTestSend,
  } from "@/api/system/set/setManagement";
  import { isNull } from "@/utils/validate";
  import { validatorRule } from "@/utils/validateRlue";

  export default {
    name: "SetManagement",
    components: {
    },
    data() {

      return {
        activeName: "def",
        smtpActiveName: "smtp-config",
        storageActiveName: 'local-config',
        smsActiveName: "sms-aliyun-config",
        dict: {},
        baseData: {},

        def: {
          form: {
            def_pass: "",
            def_role: "",
            storage_type: ""
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
              { required: false, trigger: "blur", validator: validatorRule.IS_INTEGER },
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

        emailTest: {
          form: {
            to: "",
            subject: "",
            content: "",
          },
          rules: {
            to: [
              { required: true, trigger: "change", message: "请输入收件人" },
            ],
            subject: [
              { required: true, trigger: "blur", message: "请输入主题" },
            ],
            content: [
              { required: true, trigger: "blur", message: "请输入内容" },
            ]
          },
        },

        storage: {
          storage_local: {
            form: {
              storage_local_domain: '',
              storage_local_path_prefix: '',
            },
            rules: {
              storage_local_domain: [
                { required: true, trigger: 'blur', message: '请输入域名' },
                { required: false, trigger: 'blur', validator: validatorRule.IS_URL},
              ],
            },
          },
          storage_upyun: {
            form: {
              storage_upyun_domain: '',
              storage_upyun_path_prefix: '',
              storage_upyun_bucket_name: '',
              storage_upyun_username: '',
              storage_upyun_password: '',
            },
            rules: {
              storage_upyun_domain: [
                { required: true, trigger: 'blur', message: '请输入域名' },
                { required: false, trigger: 'blur', validator: validatorRule.IS_URL},
              ],
              storage_upyun_bucket_name: [
                { required: true, trigger: 'blur', message: '请输入仓库名' },
              ],
              storage_upyun_username: [
                { required: true, trigger: 'blur', message: '请输入用户名' },
              ],
              storage_upyun_password: [
                { required: true, trigger: 'blur', message: '请输入密码' },
              ],
            },
          },
        },

        sms: {
          aliyun: {
            form: {
              sms_aliyun_access_key: '',
              sms_aliyun_access_key_secret: '',
              sms_aliyun_captcha_template_code: '',
              sms_aliyun_captcha_sign: '',
            },
            rules: {
              sms_aliyun_access_key: [
                {required: true, trigger: 'blur', message: '请输入AccessKey'},
              ],
              sms_aliyun_access_key_secret: [
                {required: true, trigger: 'blur', message: '请输入AccessKeySecret'},
              ],
              sms_aliyun_captcha_template_code: [
                {required: true, trigger: 'blur', message: '请输入验证码短信模版编号'},
              ],
              sms_aliyun_captcha_sign: [
                {required: true, trigger: 'blur', message: '请输入验证码短信签名'},
              ],
            },
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
      this.dict.storage_type = this.$getDictList("storage_type");
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
        const { data } = await doCreateCrypto(
          this.crypto.form.crypto_asymmetric
        );
        if (!isNull(data)) {
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
            const { msg } = await doUpdateOptions(data).catch(() => {
              setTimeout(() => {
                this.loadingTabs = false;
              }, 300);
            });
            this.$baseMessage(msg, "success");
            setTimeout(() => {
              this.loadingTabs = false;
            }, 300);
          } else {
            return false;
          }
        });
      },


      // 保存
      async smtpTestSend() {
        this.$refs["smtp-test-form"].validate(async (valid) => {
          if (valid) {
            const { msg } = await doTestSend(this.emailTest.form);
            this.$baseMessage(msg, "success");
            setTimeout(() => {
              this.loadingTabs = false;
            }, 300);
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
        const { data } = await getAllOptions(this.queryForm);
        if (!isNull(data)) {
          this.baseData = data;

          // 系统默认配置
          this.def.form.def_pass = !isNull(this.baseData.def_pass)?
            this.baseData.def_pass.optionValue:"";
          this.def.form.def_role = !isNull(this.baseData.def_role)?
            this.baseData.def_role.optionValue:"";
          this.def.form.storage_type = !isNull(this.baseData.storage_type)?
            this.baseData.storage_type.optionValue:"local";


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
          this.email.form.email_addresser = !isNull(this.baseData.email_addresser)?
            this.baseData.email_addresser.optionValue:"";

          // 本地存储
          this.storage.storage_local.form.storage_local_domain = !isNull(
            this.baseData.storage_local_domain
          )
            ? this.baseData.storage_local_domain.optionValue
            : ''
          this.storage.storage_local.form.storage_local_path_prefix = !isNull(
            this.baseData.storage_local_path_prefix
          )
            ? this.baseData.storage_local_path_prefix.optionValue
            : ''

          // 又拍云存储
          this.storage.storage_upyun.form.storage_upyun_domain = !isNull(
            this.baseData.storage_upyun_domain
          )
            ? this.baseData.storage_upyun_domain.optionValue
            : ''
          this.storage.storage_upyun.form.storage_upyun_path_prefix = !isNull(
            this.baseData.storage_upyun_path_prefix
          )
            ? this.baseData.storage_upyun_path_prefix.optionValue
            : ''
          this.storage.storage_upyun.form.storage_upyun_bucket_name = !isNull(
            this.baseData.storage_upyun_bucket_name
          )
            ? this.baseData.storage_upyun_bucket_name.optionValue
            : ''
          this.storage.storage_upyun.form.storage_upyun_username = !isNull(
            this.baseData.storage_upyun_username
          )
            ? this.baseData.storage_upyun_username.optionValue
            : ''

          // 阿里云验证码短信
          this.sms.aliyun.form.sms_aliyun_access_key = !isNull(
            this.baseData.sms_aliyun_access_key
          )
            ? this.baseData.sms_aliyun_access_key.optionValue
            : ''
          this.sms.aliyun.form.sms_aliyun_captcha_template_code = !isNull(
            this.baseData.sms_aliyun_captcha_template_code
          )
            ? this.baseData.sms_aliyun_captcha_template_code.optionValue
            : ''
          this.sms.aliyun.form.sms_aliyun_captcha_sign = !isNull(
            this.baseData.sms_aliyun_captcha_sign
          )
            ? this.baseData.sms_aliyun_captcha_sign.optionValue
            : ''
        }

        setTimeout(() => {
          this.loadingData = false;
        }, 300);
      },
    },
  };
</script>
<style>
  .setManagement-container .tab-pane {
    padding-right: 15px;
    padding-left: 15px;
  }

</style>
