<template>
  <div class="personalCenter-container">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="基本设置">
        <el-row>
          <h2>基本设置</h2>
          <el-divider></el-divider>
        </el-row>
        <el-row>
          <el-form ref="baseForm" :model="baseForm" :rules="baseRules" label-width="100px">

            <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="line"
              v-if="baseFormOrgInput !== '' "
            >
              <el-form-item label="组织机构：" prop="username" style="font-weight: bold">
                <el-input
                  v-model.trim="baseFormOrgInput"
                  autocomplete="off"
                  disabled
                  title="组织机构"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="line">
              <el-form-item label="用户名：" prop="username" style="font-weight: bold">
                <el-input
                  v-model.trim="baseForm.username"
                  autocomplete="off"
                  disabled
                  title="用户名不可更改"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="line">
              <el-form-item label="昵称：" prop="realName" style="font-weight: bold">
                <el-input v-model.trim="baseForm.realName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="line">
              <el-form-item label="我的签名：" prop="sign" style="font-weight: bold">
                <el-input type="textarea" v-model="baseForm.sign" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="line">
              <el-form-item label="手机：" prop="mobile" style="font-weight: bold">
                <el-input v-model.trim="baseForm.mobile" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="line">
              <el-form-item label="邮箱：" prop="email" style="font-weight: bold">
                <el-input v-model.trim="baseForm.email" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
                   style="padding-left: 20px" class="line">
              <el-button type="primary" @click="saveUser"> 保存 </el-button>
            </el-col>

          </el-form>

          <el-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
            <div class="element-upload-preview" @click="showAvatarEdit()" >
              <vab-icon :icon="['fas', 'cloud-upload-alt']" class="upload-icon"></vab-icon>
              <div class="mask">
                <vab-icon :icon="['fas', 'ellipsis-h']" class="upload-mask-icon" ></vab-icon>
              </div>
              <div></div>
              <el-avatar v-if="!avatar"
                         icon="el-icon-user-solid"
                         :size="180" style="font-size: 80px"
              ></el-avatar>
              <div v-else :style="{ minHeight: '180px' }">
                <img :src="avatar" alt="头像去火星了">
              </div>
            </div>
          </el-col>

        </el-row>
      </el-tab-pane>
      <el-tab-pane label="安全设置">
        <el-row>
          <h2>安全设置</h2>
          <el-divider></el-divider>
        </el-row>
        <el-row>
          <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
                  style="padding-left: 20px" class="line">
              <el-button type="primary" @click="updatePassword"> 修改密码 </el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <update-password ref="update-password"></update-password>
    <avatar-edit ref="avatar-edit" @fetchData="fetchData" ></avatar-edit>

  </div>
</template>

<script>
  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo,getUserOrg } from "@/api/user";
  import { isEmail, isName, isNull, isPhone} from "@/utils/validate";
  import { doUpdate } from "@/api/userManagement";
  import UpdatePassword from "./components/UserManagementPassword";
  import AvatarEdit from "./components/AvatarEdit";
  import { mapGetters } from "vuex";
  const { baseURL } = require("@/config/settings");

  export default {
    name: "PersonalCenter",
    components: { UpdatePassword, AvatarEdit },
    data() {

      const validateRealName = (rule, value, callback) => {
        if (isNull(value)) {
          callback(new Error("请输入昵称"));
        } else if (!isName(value)) {
          callback(new Error("请输入正确的昵称格式"));
        } else {
          callback();
        }
      };


      const validateMobile = (rule, value, callback) => {
        if (!isNull(value) && !isPhone(value)) {
          callback(new Error('请输入正确的手机号格式'));
        } else {
          callback();
        }
      };

      const validateEmail = (rule, value, callback) => {
        if (!isNull(value) && !isEmail(value)) {
          callback(new Error('请输入正确的邮箱格式'));
        } else {
          callback();
        }
      };

      return {
        proFileLoading: true,
        baseFormOrg: {},
        baseFormOrgInput: '',
        baseForm: {
          locked: "0"
        },
        baseRules: {
          realName: [
            {required: true, trigger: "blur", validator: validateRealName},
          ],
          mobile: [
            {required: false, trigger: "blur", validator: validateMobile},
          ],
          email: [
            {required: false, trigger: "blur", validator: validateEmail},
          ],
        },
        // cropper
        preview: {},
        tabPosition: "left",
      };
    },
    created() {
      // 加载用户信息
      this.fetchData();
      // 加载用户组织机构
      this.fetchOrgData();
    },
    computed: {
      ...mapGetters({
        avatar: "user/avatar"
      }),
    },
    methods: {
      showAvatarEdit(){
        this.$refs["avatar-edit"].showAvatarEdit({
          id: this.baseForm.id,
          avatar: this.avatar
        });
      },
      saveUser() {
        this.$refs["baseForm"].validate(async (valid) => {
          if (valid) {
            if (!isNull(this.baseForm.id)) {
              const { success, msg } = await doUpdate(this.baseForm);
              if (success) {
                this.$baseMessage(msg, "success");
                this.fetchData()
              }
            }
          }
        });
      },
      updatePassword() {
        this.$refs["update-password"].showUpdatePassword();
      },
      // 获取数据
      async fetchData() {
        let accessToken = getAccessToken();
        const { data } = await getUserInfo(accessToken);
        if (!isNull(data)) {
          this.baseForm = Object.assign({}, data);
          this.baseForm.locked = "0";
        }
      },

      // 获取数据
      async fetchOrgData() {
        let accessToken = getAccessToken();
        this.proFileLoading = true;
        const { data } = await getUserOrg(accessToken);
        if(!isNull(data)){
          this.baseFormOrg = Object.assign({}, data);
          // 展示字段
          if(!isNull(this.baseFormOrg)){
            if(!isNull(this.baseFormOrg.companyName)){
              this.baseFormOrgInput += this.baseFormOrg.companyName+'(公司)';
            }
            if(!isNull(this.baseFormOrg.departmentName)){
              this.baseFormOrgInput += ' - '+this.baseFormOrg.departmentName+'(部门)';
            }
            if(!isNull(this.baseFormOrg.postName)){
              this.baseFormOrgInput += ' - '+this.baseFormOrg.postName+'(岗位)';
            }
          }

          setTimeout(() => {
            this.proFileLoading = false;
          }, 300);
        }
      },

    },
  };
</script>
<style lang="scss" scoped>
  .personalCenter-container{
    .line{
      clear: both;
    }
  }

  .element-upload-preview {
    position: absolute;
    top: 20px;
    right: 50px;
    width: 100%;
    max-width: 180px;
    min-height: 180px;
    margin: 0 auto;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      padding: 0.5rem;
      font-size: 1.4rem;
      background: rgba(222, 221, 221, 0.7);
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 50%;
    }

    .upload-mask-icon {
      position: absolute;
      top: 68px;
      right: 66px;
      padding: 0.5rem;
      font-size: 2rem;
      color: #d6d6d6;
    }


    .mask {
      position: absolute;
      cursor: pointer;
      background: rgba(0,0,0,0.4);
      opacity: 0;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      overflow: hidden;
      border-radius: 50%;
    }
  }

  .avatar-upload-wrapper {
    width: 100%;
    height: 200px;
  }
</style>
