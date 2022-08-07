<template>
  <div class="personalCenter-container">
      <el-row>
        <h2>基本设置</h2>
      </el-row>
      <el-row class="hidden-md-and-up">
        <el-col :xs="24" :sm="24"
                class="avatar-view" :style="{ minHeight: '180px' }">
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
              <img :src="avatar" />
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" >
          <el-form ref="baseForm" :model="baseForm" :rules="baseRules" label-width="100px">
            <el-col :span="24" class="line"
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

            <el-col :span="24" class="line">
              <el-form-item label="用户名：" prop="username" style="font-weight: bold">
                <el-input
                  v-model.trim="baseForm.username"
                  autocomplete="off"
                  disabled
                  title="用户名不可更改"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="line">
              <el-form-item label="昵称：" prop="realName" style="font-weight: bold">
                <el-input v-model.trim="baseForm.realName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="line">
              <el-form-item label="我的签名：" prop="sign" style="font-weight: bold">
                <el-input type="textarea" v-model="baseForm.sign" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" style="padding-left: 20px" class="line">
              <el-button type="primary" @click="saveUser"> 保存 </el-button>
            </el-col>

          </el-form>
        </el-col>
      </el-row>

    <el-row :gutter="10" class="hidden-sm-and-down">
      <el-col :md="12" :lg="12" :xl="12">
        <el-form ref="baseForm" :model="baseForm" :rules="baseRules" label-width="100px">
          <el-col :span="24" class="line"
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

          <el-col :span="24" class="line">
            <el-form-item label="用户名：" prop="username" style="font-weight: bold">
              <el-input
                v-model.trim="baseForm.username"
                autocomplete="off"
                disabled
                title="用户名不可更改"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="line">
            <el-form-item label="昵称：" prop="realName" style="font-weight: bold">
              <el-input v-model.trim="baseForm.realName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="line">
            <el-form-item label="我的签名：" prop="sign" style="font-weight: bold">
              <el-input type="textarea" v-model="baseForm.sign" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="24" style="padding-left: 20px" class="line">
            <el-button type="primary" @click="saveUser"> 保存 </el-button>
          </el-col>

        </el-form>
      </el-col>


      <el-col :md="12" :lg="12" :xl="12"
              class="avatar-view" :style="{ minHeight: '180px' }">
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
            <img :src="avatar" />
          </div>
        </div>
      </el-col>

    </el-row>

    <avatar-edit ref="avatar-edit" @fetchData="fetchData" ></avatar-edit>
  </div>
</template>

<script>
  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo, getUserOrg } from "@/api/user";
  import { isEmail, isName, isNull, isPhone} from "@/utils/validate";
  import { doUpdateSelf } from "@/api/system/user/userManagement";
  import AvatarEdit from "../AvatarEdit";
  import { mapGetters } from "vuex";
  const { baseURL } = require("@/config/settings");

  export default {
    name: "PersonalCenterBase",
    components: { AvatarEdit },
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
              const { msg } = await doUpdateSelf(this.baseForm);
              this.$baseMessage(msg, "success");
              await this.fetchData()
            }
          }
        });
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
  .avatar-view {
    padding: 50px;
  }
}

.element-upload-preview {
  position: relative;
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
