<template>
  <div id="vue-admin-beautiful">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App",
    mounted() {},
  };
</script>
<style>
  .input-btn-choose{
    position: absolute;
    top: 0;
    right: 0;
  }
  .el-dialog__header,.el-dialog__body,.el-dialog__footer{
    display: grid;
  }

  /* 下拉提示菜单 */
  .inline-input-container .inline-input-value {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .inline-input-container .inline-input-describe {
    font-size: 12px;
    color: #b4b4b4;
  }
  .inline-input-container .highlighted .inline-input-describe {
    color: #ddd;
  }
  /* input clear */
  .input-clear {
    position: absolute;
    top: 1px;
    right: 50px;
    font-size: 16px;
    color: #909399;
    cursor: pointer;
    user-select: none;
  }

  /* 导入Excel */
  .import-excel .el-upload{
    width: 100%;
  }
  .import-excel .el-upload .el-upload-dragger{
    width: 100%;
  }
</style>
