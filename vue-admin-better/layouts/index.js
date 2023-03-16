/* eslint-disable */
const chalk = require('chalk')
module.exports = {
  webpackBarName: 'vue-admin-better',
  webpackBanner:
    ' build: vue-admin-better \n vue-admin-beautiful.com \n https://gitee.com/chu1204505056/vue-admin-better \n time: ',
  donationConsole() {
    const chalk = require('chalk')
    console.log(
      chalk.green(
        `> 欢迎使用OPSLI 快速开发平台，github开源地址：https://github.com/hiparker/opsli-boot`
      )
    )
    console.log(
      chalk.green(
        `> 欢迎使用OPSLI 快速开发平台，码云开源地址：https://gitee.com/hiparker/opsli-boot`
      )
    )

    console.log(chalk.green(`> 本程序 前端使用 vue-admin-better 开源版本`))

    console.log(
      chalk.green(
        `> 使用中出现任何问题可加QQ群反馈，获取基础版、文档，请我们喝杯咖啡（如若情况不允许，请勿勉强）`
      )
    )

    console.log(chalk.green(`> 如果您不希望显示以上信息，可在config中配置关闭`))
    console.log('\n')
  },
}
