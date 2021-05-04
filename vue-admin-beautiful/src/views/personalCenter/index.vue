<template>
  <div class="personalCenter-container">

    <el-row :gutter="10" class="hidden-md-and-up">
      <el-tabs tab-position="top">
        <el-tab-pane label="基本设置">
          <profile-base/>
        </el-tab-pane>
        <el-tab-pane label="安全设置">
          <profile-security/>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-row :gutter="10" class="hidden-sm-and-down">
      <el-tabs tab-position="left">
        <el-tab-pane label="基本设置">
          <profile-base/>
        </el-tab-pane>
        <el-tab-pane label="安全设置">
          <profile-security/>
        </el-tab-pane>
      </el-tabs>
    </el-row>

  </div>
</template>

<script>
  import ProfileBase from "./components/profiles/base";
  import ProfileSecurity from "./components/profiles/security";

  export default {
    name: "PersonalCenter",
    components: { ProfileBase, ProfileSecurity },
    data() {
      return {};
    },
    created() {

    },
    methods: {

    },
  };
</script>

