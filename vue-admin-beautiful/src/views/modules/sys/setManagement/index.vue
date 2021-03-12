<template>
  <div v-loading="loadingData" class="setManagement-container">
    <el-tabs v-model="activeName" v-loading="loadingTabs">
      <el-tab-pane label="系统默认" name="def">
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

      <el-tab-pane label="接口加密" name="crypto">
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


  export default {
    name: "SetManagement",
    components: {
    },
    data() {
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

          setTimeout(() => {
            this.loadingData = false;
          }, 300);
        }
      },
    },
  };
</script>
