<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="650px"
    @close="close"
  >
    <!-- 如果没头像 则上传 -->
    <el-row class="upload-avatar" :gutter="10">
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
        <label class="el-button el-button--primary el-button--small" for="uploads">上传头像</label>
        <input
          id="uploads" ref="uploadImg"
          multiple
          type="file"
          accept="image/png,image/jpeg,image/gif,image/jpg"
          @change="uploadImg($event)"/>
      </el-col>
      <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <div class="description-text">
          支持JPG、PNG等格式图片
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
        <div class="avatar-cropper">
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
        </div>
      </el-col>

      <el-col class="hidden-sm-and-down" :md="11" :lg="11" :xl="11">
        <div class="avatar-preview">
          <div class="preview preview-circle"
               :style="previews.div" >
            <img :src="previews.url" :style="previews.img" />
          </div>
          <div class="preview"
               :style="previews.div">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col class="avatar-button" :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
        <el-button icon="el-icon-plus" @click="changeScale(1)" round>放大</el-button>
        <el-button icon="el-icon-minus" @click="changeScale(-1)" round>缩小</el-button>
        <el-button icon="el-icon-refresh-left" @click="turnLeft" round>左转</el-button>
        <el-button icon="el-icon-refresh-right" @click="turnRight" round>右转</el-button>
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
  import { doUpdateAvatar } from '@/api/system/user/userManagement'
  import { doUpload } from '@/api/tool/ossTool'
  import axios from "axios";
  import {baseURL, requestTimeout } from "@/config/settings";
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
          imgName: "",
          info: true,
          size: 1,
          outputType: 'image/jpeg',
          suffixName: '.jpg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 150,
          autoCropHeight: 150,
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
        let _this = this;
        this.dialogVisible = true;
        this.id = row.id;
        // 其中this.avatar为当前头像
        this.setAvatarBase64(row.avatar, (base64) => {
          _this.options.img = base64;
        });
      },
      close() {
        this.id = null;
        this.options.img = "";
        this.options.imgName = "";
        this.dialogVisible = false;
      },
      turnLeft() {
        this.$refs.cropper.rotateLeft();
      },
      turnRight() {
        this.$refs.cropper.rotateRight();
      },
      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      save() {
        this.$refs.cropper.getCropBlob(data => {
          let blobObject = new Blob([data]);

          let fileTemp = new window.File(
            [blobObject],
            this.options.imgName,
            {type: this.options.outputType}
          );

          this.doUpdateAvatarAsync(fileTemp);
        });
      },
      async doUpdateAvatarAsync(file){
        this.confirmLoading = true

        let formData = new window.FormData()
        formData.append("file", file);

        const { data} = await doUpload(formData);
        if(data){
          const { msg } = await doUpdateAvatar({
            imgUrl: data.fileStoragePath
          });

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

        // 去掉默认后缀名 统一后缀名
        this.options.imgName = file.name.split('.')[0] + this.options.suffixName;

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
      },
      // 设置头像base64
      setAvatarBase64(src, callback) {
        let _this = this;
        let image = new Image();
        // 处理缓存
        image.src = src + '?v=' + Math.random();
        // 支持跨域图片
        image.crossOrigin = "*";
        image.onload = function () {
          let base64 = _this.transBase64FromImage(image);
          callback && callback(base64);
        }
      },
      // 将网络图片转换成base64格式
      transBase64FromImage(image) {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        // 可选其他值 image/jpeg
        return canvas.toDataURL(this.options.outputType);
      },
    }
  };
</script>
<style lang="scss" scoped>

  .upload-avatar {
    padding-bottom: 15px;

    .el-col{
      height: 32px;
      line-height: 32px;

      input{
        display: none;
      }
      .description-text{
        font-size: 13px;
        color: #9194ab;
      }
    }
  }

  /* 裁剪工具 */
  .avatar-cropper {
    width: 325px;
    height: 325px;
    margin: 0 auto;
  }

  /* 右侧预览项 */
  .avatar-preview {
    .preview{
      margin: 0 auto;
      overflow: hidden;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
      box-shadow: 0 0 4px #ccc;
    }
    .preview:first-child{
      margin-bottom: 22px;
    }
    .preview-circle {
      border-radius: 50%;
    }
  }

  /* 底部按钮 */
  .avatar-button button{
    margin-top: 10px;
    margin-bottom: 10px;
  }

  @media screen and (max-width: 550px) {
    .avatar-cropper {
      width: 260px;
      height: 260px;
    }
  }
</style>
