<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="800px"
    @close="close"
  >
    <!-- 如果没头像 则上传 -->
    <dl class="upload-avatar">
      <dt>
        <label class="el-button el-button--primary el-button--small" for="uploads">上传头像</label>
        <input
          id="uploads" ref="uploadImg"
          multiple
          type="file"
          accept="image/png,image/jpeg,image/gif,image/jpg"
          class="hiddenInput" @change="uploadImg($event)"/>
      </dt>
      <dd>支持JPG、PNG等格式图片大小不超过1M，超出自动压缩</dd>
    </dl>

    <el-row>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :maxImgSize="options.maxImgSize"
          @realTime="realTime"
        >
        </vue-cropper>
      </el-col>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">

      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { VueCropper } from 'vue-cropper'
  import { doUpdateAvatar } from '@/api/userManagement'
  import axios from "axios";
  import {baseURL, requestTimeout, tokenName} from "@/config/settings";
  import store from "@/store";

  export default {
    name:"AvatarEdit",
    components: {
      VueCropper
    },
    data() {

      return {
        title: "上传头像",
        instance: null,
        dialogVisible: false,
        downImg: "#",
        id: null,
        confirmLoading: false,
        options: {
          img: "",
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          maxImgSize: 1048,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },
        previews: {},
      };
    },
    created() {
      this.instance = axios.create({
        baseURL,
        timeout: requestTimeout,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    methods: {
      showAvatarEdit(row) {
        this.dialogVisible = true;
        this.id = row.id;
        /* 获取原始头像 */
        this.options.img = row.avatar;
      },
      close() {
        this.id = null;
        this.dialogVisible = false;
      },
      save() {
        this.$refs.cropper.getCropBlob(data => {
          let blobObject = new Blob([data]);

          let formData = new window.FormData()
          formData.append("file", blobObject);

          this.doUpdateAvatarAsync(formData);
        });
      },
      async doUpdateAvatarAsync(formData){
        this.confirmLoading = true
        const { success, msg} = await doUpdateAvatar(formData);
        if( success ){
          // 刷新用户信息
          await store.dispatch("user/getUserInfo");
          // 刷新父类信息
          await this.$emit("fetchData");
          this.confirmLoading = false
          this.close()
          this.$baseMessage( msg, "success");
        }
      },
      uploadImg(e) {
        //上传图片
        // this.option.img
        let file = e.target.files[0];
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          this.$baseMessage("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种", "error");
          return false;
        }
        let reader = new FileReader();
        reader.onload = e => {
          let data;
          if (typeof e.target.result === "object") {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }
          this.options.img = data;
          this.$refs.uploadImg.value = ''
        };
        // 转化为base64
        //reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
      },
      realTime(data) {
        this.previews = data
      }
    }
  };
</script>
<style lang="scss" scoped>

  .upload-avatar {

    .hiddenInput{
      display: none;
    }

    dt {
      float: left;
      overflow: hidden;
    }

    dd {
      float: left;
      margin-top: 9px;
      font-size: 13px;
      color: #9194ab;
    }
  }

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    width: 180px;
    height: 180px;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    transform: translate(50%, -50%);

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
