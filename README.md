# OPSLI 快速开发平台 (v2.0)
<div align="center">
 <img width="500" src="https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/logo.png"/>
 <br/> <br/>

[![AUR](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://github.com/hiparker/opsli-boot/blob/master/LICENSE) [![spring-boot](https://img.shields.io/badge/spring--boot-2.5.6.RELEASE-green.svg)](http://spring.io/projects/spring-boot) [![mybatis-plus](https://img.shields.io/badge/mybatis--plus-3.5.2-blue.svg)](http://mp.baomidou.com) [![hutool](https://img.shields.io/badge/hutool-5.7.14-blue.svg)](https://www.hutool.cn) [![Stars](https://img.shields.io/github/stars/hiparker/opsli-boot?style=flat-square&label=Stars&logo=github)](https://github.com/hiparker/opsli-boot) [![Forks](https://img.shields.io/github/forks/hiparker/opsli-boot?style=flat-square&label=Forks&logo=github)](https://github.com/hiparker/opsli-boot)
</div>

## 关于
> OPSLI 是一款的低代码快速平台，零代码开发，致力于做更简洁的后台管理系统！

> OPSLI 快速开发平台基于springboot、vue、element-ui ，项目采用前后端分离架构，热插拔式业务模块与插件扩展性高 ,代码简洁，功能丰富，开箱即用，帮助Java项目解决70%的重复工作，让开发更关注业务逻辑，既能快速提高效率，节省研发成本，同时又不失灵活性！ 

## 地址
- 官方网站: <a href="https://opsli.com" target="_blank">https://opsli.com</a>
- 演示地址: <a href="https://demo.opsli.bedebug.com" target="_blank">https://demo.opsli.bedebug.com</a>
- 文档地址: <a href="https://wiki.opsli.bedebug.com" target="_blank">https://wiki.opsli.bedebug.com</a>
- 作者博客: <a href="https://www.bedebug.com" target="_blank">https://www.bedebug.com</a>
- 问题反馈: <a href="https://github.com/hiparker/opsli-boot/issues" target="_blank">https://github.com/hiparker/opsli-boot/issues</a>
- 交流Q群: 724850675 (1群)

## 技术选型
### 前端
- vue-admin-beautiful

### 后端版本
> 单机版

| 名称             | 版本号 |      | 名称           | 版本号          |
| ---------------- |---| ---- | -------------- |--------------|
| jdk版本          | 1.8 |      | springboot版本 | 2.7.10        |
| mybatis-plus版本 | 3.5.2 |      | pagehelper版本 | 1.4.6        |
| druid版本        | 1.1.17 |      | dynamic版本    | 2.5.4        |
| fastjson版本  | 1.2.83  |      | transmittable版本        | 2.12.5       |
| ehcache版本      | 3.9.0 |      | easyexcel版本  | 2.2.6        |
| captcha版本      | 1.6.2 |      | guava版本      | 30.0-android |
| enjoy版本        | 4.9.06 |      | hutool版本     | 5.7.14       |

## 在线演示
> - 地址：<a href="https://demo.opsli.bedebug.com" target="_blank">https://demo.opsli.bedebug.com</a>
> - 账号：demo
> - 密码：Aa123456

--------------------------------------------
> -  数据库监控/系统接口
> - 账号: admin
> - 密码: 123456

## 功能特点

**高扩展登录**：基于Spring Security 改造的高扩展接口，便于后期支持邮箱、手机、账号密码、第三方等登录

**高扩展API管控**：自动支持v1-vn 多版本、多终端接口兼容，业务扩展不打架

**代码生成**：采用自研的代码生成器+Jfinal Enjoy 模板引擎，在线可视化生成前后端代码，可自定义生成代码模版

**多租户功能**：采用自研完善的多租户SaaS功能，提供行业SaaS全套解决方案

**登录安全**：登录数据采用双向加密模式，后台一键式切换加密秘钥，保障登录用户隐私安全

**数据安全**：支持自定义注解，一键式加密数据

**缓存安全**：采用自研的 Security Cache，解决缓存穿透、击穿、雪崩问题

**身份安全**：修改邮箱、手机号或忘记密码时，有独立的身份认证鉴权

**在线文档**：通过接入Knife4j，实现在线API文档的查看与调试;

**业务分离**：采用前后端分离的框架设计，前端采用vue-admin-beautiful（开源版本 基于element-ui）


## 扩展登录
![opsli-login-auth](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/login-auth-code.jpeg)


## 系统预览
![opsli-login](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/login.jpg)

![opsli-2](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/opsli-2.jpg)

![opsli-3](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/opsli-3.jpg)

![opsli-self](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/self.jpg)

![opsli-auth](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/auth.jpg)

![opsli-4](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/opsli-4.jpg)

![opsli-5](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/opsli-5.jpg)

![opsli-7](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/opsli-7.jpg)

![opsli-8](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/opsli-8.jpg)

![opsli-setting](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/setting.jpg)

![opsli-9](https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/opsli-9.jpg)


## 作者寄语
感谢Star，感恩相遇，愿世间美好与我们环环相扣，加油！屏幕前的我们，打破桎梏，坚守初心。其实人生改变命运的机会并没有太多，我们并不是不优秀，我们也并不是一无是处，我们也希望驻足山巅被众人仰望，也许我们缺少的只是一个机会，缺少的只是生命中的导师，我希望这个框架帮助到更多的人，希望有一天，我们面试的时候不再胆怯，希望有一天别人看到的不仅仅是你的努力，还有你的功成名就，出人头地。

## 鸣谢

- <a href="https://www.jetbrains.com/?from=opsli-boot" rel="nofollow">感谢 JetBrains 提供的免费开源 License:</a>

    <a href="https://www.jetbrains.com/?from=opsli-boot" rel="nofollow"><img src="https://camo.githubusercontent.com/a4b533abbf1bd277a3943956fa8bed240b02184ccc6b5e9f751ae2f5afd7cfa6/687474703a2f2f7374617469632e786b636f64696e672e636f6d2f737072696e672d626f6f742d64656d6f2f3036343331322e6a7067" width="100px" alt="jetbrains"  style="max-width:100%;"></a>

## 版权说明

opsli-boot 采用 Apache License2.0协议

opsli-ui 是对于市面上开源的产品进行的二次开发，请相关开发者遵循对应前端框架的开源协议

代码可用于个人项目等接私活或企业项目脚手架使用，完全免费

二次开发如用于开源竞品请先联系群主沟通，未经审核视为侵权

请不要删除和修改源码头部的版权与作者声明及出处

## 贡献者列表

[![contributors](https://whnb.wang/contributors/hiparker/opsli-boot)](https://github.com/hiparker/opsli-boot)

## Stars 趋势

### Gitee
[![Stargazers over time](https://whnb.wang/stars/hiparker/opsli-boot)](https://github.com/hiparker/opsli-boot)

### Github
[![Stargazers over time](https://starchart.cc/hiparker/opsli-boot.svg)](https://github.com/hiparker/opsli-boot)


## 支持

> 谢谢您愿意支持开源

<div align="center">
<img width="200" src="https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/vx.png"/>
<img width="200" src="https://gitee.com/hiparker/opsli-ui/raw/master/repository-images/zfb.png"/>
</div>
