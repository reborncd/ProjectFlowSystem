# 即富项目管理系统

> 基于 Vue 和 Element UI 制作的项目管理系统

## 构建步骤

1. 安装依赖: `npm install`, 推荐使用yarn进行模块管理
2. 开发模式下启动: `npm start` 或 `npm run dev`
3. 构建生成目标程序: `npm run build`
4.  构建并生成性能报告: `npm run build --report`

## 依赖包说明

* [Vue](https://vuejs.org/): 框架引擎
* [Element UI](http://element-cn.eleme.io/#/zh-CN)@2.0.11: UI组件

## 项目中推荐

1. [less](http://lesscss.org/): 借助less管理css, 可以定义全局css变量及函数, 使css可以模块化, 方便管理
2. [vuex](https://vuex.vuejs.org/): 状态管理工具
3. 使用flex和rem配合px达到页面自适应和流动布局

# 项目结构
```
.
├── build                          # 构建时会用到的配置文件放在这里
│   ├── build.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── ......
├── config                         # 开发环境及打包的配置项设置
│   ├── dev.env.js
│   ├── index.js                   # dev和build分别表示开发环境和打包环境
│   ├── prod.env.js
│   └── test.env.js
├── dist                           # 打包后目标文件的输出
├── index.html                     # 首页
├── package.json
├── README.md
├── src
│   ├── App.vue
│   ├── components                 # 组件仓库
│   │   └── ......
│   ├── main.js
│   ├── index.less                 # less样式文件根继承, 用于存放css变量及方法
│   ├── router.js                  # 路由配置
│   ├── static                     # 网站内静态文件存放仓库
│   └── vendor.js
├── static                         # 静态文件, 打包时不编译, 放于根目录
├── test                           # 用于单元测试
```
