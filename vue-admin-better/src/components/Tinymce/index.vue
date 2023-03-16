<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div>
  </div>
</template>

<script>
  /**
   * docs:
   * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
   */
  import editorImage from "./components/EditorImage";
  import plugins from "./plugins";
  import toolbar from "./toolbar";
  import load from "./dynamicLoadScript";

  // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
  const tinymceCDN = "/static/tinymce/tinymce.min.js";

  export default {
    name: "Tinymce",
    components: { editorImage },
    props: {
      id: {
        type: String,
        default: function () {
          return (
            "vue-tinymce-" +
            +new Date() +
            ((Math.random() * 1000).toFixed(0) + "")
          );
        },
      },
      value: {
        type: String,
        default: "",
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return [];
        },
      },
      menubar: {
        type: String,
        default: "file edit insert view format table",
      },
      height: {
        type: [Number, String],
        required: false,
        default: 360,
      },
      width: {
        type: [Number, String],
        required: false,
        default: "auto",
      },
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false,
        languageTypeList: {
          zh: "zh_CN",
          en: "en",
          es: "es_MX",
          ja: "ja",
        },
      };
    },
    computed: {
      containerWidth() {
        const width = this.width;
        if (/^[\d]+(\.[\d]+)?$/.test(width)) {
          // matches `100`, `'100'`
          return `${width}px`;
        }
        return width;
      },
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || "")
          );
        }
      },
    },
    mounted() {
      this.init();
    },
    activated() {
      if (window.tinymce) {
        this.initTinymce();
      }
    },
    deactivated() {
      this.destroyTinymce();
    },
    destroyed() {
      this.destroyTinymce();
    },
    methods: {
      init() {
        // dynamic load tinymce from cdn
        load(tinymceCDN, (err) => {
          if (err) {
            this.$message.error(err.message);
            return;
          }
          this.initTinymce();
        });
      },
      initTinymce() {
        const _this = this;
        window.tinymce.init({
          selector: `#${this.tinymceId}`,
          language: this.languageTypeList["zh"],
          height: this.height,
          body_class: "panel-body ",
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          toolbar_mode: "wrap",
          toolbar_sticky: true,
          autosave_ask_before_unload: false,
          menubar: false,
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: "clean",
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: "square",
          advlist_number_styles: "default",
          imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
          default_link_target: "_blank",
          link_title: false,
          branding: false,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
          font_formats:
            "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif",
          init_instance_callback: (editor) => {
            if (_this.value) {
              editor.setContent(_this.value);
            }
            _this.hasInit = true;
            editor.on("NodeChange Change KeyUp SetContent", () => {
              this.hasChange = true;
              this.$emit("input", editor.getContent());
            });
          },
          setup(editor) {
            editor.on("FullscreenStateChanged", (e) => {
              _this.fullscreen = e.state;
            });
          },
          // it will try to keep these URLs intact
          // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
          // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
          convert_urls: false,
          // 整合七牛上传
          // images_dataimg_filter(img) {
          //   setTimeout(() => {
          //     const $image = $(img);
          //     $image.removeAttr('width');
          //     $image.removeAttr('height');
          //     if ($image[0].height && $image[0].width) {
          //       $image.attr('data-wscntype', 'image');
          //       $image.attr('data-wscnh', $image[0].height);
          //       $image.attr('data-wscnw', $image[0].width);
          //       $image.addClass('wscnph');
          //     }
          //   }, 0);
          //   return img
          // },
          // images_upload_handler(blobInfo, success, failure, progress) {
          //   progress(0);
          //   const token = _this.$store.getters.token;
          //   getToken(token).then(response => {
          //     const url = response.data.qiniu_url;
          //     const formData = new FormData();
          //     formData.append('token', response.data.qiniu_token);
          //     formData.append('key', response.data.qiniu_key);
          //     formData.append('file', blobInfo.blob(), url);
          //     upload(formData).then(() => {
          //       success(url);
          //       progress(100);
          //     })
          //   }).catch(err => {
          //     failure('出现未知问题，刷新页面，或者联系程序员')
          //     console.log(err);
          //   });
          // },
        });
      },
      destroyTinymce() {
        const tinymce = window.tinymce.get(this.tinymceId);
        if (this.fullscreen) {
          tinymce.execCommand("mceFullScreen");
        }

        if (tinymce) {
          tinymce.destroy();
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value);
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent();
      },
      imageSuccessCBK(arr) {
        arr.forEach((v) =>
          window.tinymce
            .get(this.tinymceId)
            .insertContent(`<img class="wscnph" src="${v.url}" >`)
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container {
    ::v-deep {
      .mce-fullscreen {
        z-index: 10000;
      }
    }
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
