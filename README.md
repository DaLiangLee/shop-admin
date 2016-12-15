# 商家后台

## 演示


## 安装

#### 安装Gulp
```sh
$ npm install gulp -g
```
#### 安装Bower
```sh
$ npm install bower -g
```
#### 安装npm包
```sh
$ npm install && bower install
```
#### 开启服务（node模拟api请求）
```sh
$ npm api
```
#### 开启开发 
```sh
$ npm start
```
#### 开启单元测试
```sh
$ npm unit
```
#### 开启端到端测试（需要安装对应的环境，java jdk最新版即可）
```sh
$ npm e2e
```

## 支持浏览器

* Chrome
* Firefox
* IE8+
* Opera
* Safari

   
## 技术栈

 1. angular v1.2.29
  1.1 angular-cookies v1.2.29
  1.2 angular-animate v1.2.29
  1.3 angular-sanitize v1.2.29
  1.4 angular-ui-router v0.2.15
 2. jquery v1.11.3
 3. gulp 
 4. bower
 5. nodejs
        
    

## 开发目录结构说明

```
admin/
 ├──.tmp/                      * 开发临时目录
 ├──gulp/                      * gulp task集合
 |   ├──.eslintrc              * js语法检查
 |   ├──config.js              * gulp配置
 |   ├──build.js               * 打包发布
 |   ├──inject.js              * 注入处理
 │   ├──service.js             * 开启本地服务器
 │   ├──watch.js               * 监听文件处理
 │   ├──styles.js              * 样式处理
 │   └──scripts.js             * 脚本处理
 │
 ├──src/                       * 开发目录
 │   │
 │   ├──index.html              * 入口首页
 │   │
 │   ├──app/                      * app文件
 │   │     ├──components/             * 组件型指令
 │   │     ├──decorations/            * 装饰器型指令
 │   │     ├──filters/                * 过滤器
 │   │     ├──module/                 * 模块
 │   │     ├──constants/              * 常量配置
 │   │     ├──services/               * 公共服务
 │   │     ├──configs/                * 系统配置
 │   │     │     ├──config.js         * config阶段配置
 │   │     │     ├──router.js         * 路由配置
 │   │     │     ├──run.js            * run阶段配置
 │   │     ├──pages/                  * 详细页面
 │   │     ├──index.module.js         * 入口文件
 │   │     ├──index.css               * app样式
 │   │
 │   └──assets/                * 静态资源
 │       ├──images/            * 网站图片
 │ 
 ├──e2e/                       * 端到端测试用例
 │
 │
 │
 ├──service/                   * 开发目录
 │   ├──app.js                 * 后端启动文件
 │   │
 │   ├──data/                  * 开发临时数据库
 │   │
 │   ├──routers/                * api路由 对应前端ajax请求路由
 │   │   ├──index/              * 首页路由
 │
 ├──package.json               * NPM用于管理其依赖关系
 ├──protractor.conf.js         * 端到端测试配置
 ├──karma.conf.js              * 单元测试配置
 ├──.yo-rc.json                * 端到端测试依赖关系
 ├──.eslintrc                  * js语法检查
 ├──.bowerrc                   * bower配置文件
 ├──bower.json                 * bower用于管理其依赖关系
 ├──.gitignore                 * git不提交的文件
 └──gulpfile.js                * gulp配置文件

```

## 发布目录结构说明

```
admin/
 ├──build/                      * 发布目录
 │   ├──index.html              * 入口页面
 │   ├──scripts/                * 脚本
 │   │   ├──vendor.js/          * 打包库文件
 │   │   ├──app.js/             * 打包其他文件
 │   ├──styles/                 * 样式
 │   │   ├──vendor.css/         * 打包库文件
 │   │   ├──app.css/            * 打包其他文件
 │   ├──fonts/                  * 字体图标
 │   └──assets/                 * 静态图片

```


## 其他说明




