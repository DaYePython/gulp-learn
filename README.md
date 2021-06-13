
[TOC]

# 了解glup
`glup`是一个基于**流**的自动化打包构建工具, 基于**node.js**读写文件的操作,

## 作用 
+ css(压缩 自动添加前缀)
+ js(压缩转码)
+ html(压缩 转码)
+ 静态资源
+ 第三方资源 ...

## 什么是流
+ `流文件`  文件传输的一种格式, 数据以段的形式传输
+ `流格式` '流水线' '从头到尾' 从源头开始一步一步, 每一个步骤都依赖前一个步骤的结果, 最终完成成品

## 安装
全局安装
```
// in project
yarn add -D gulp

// or global
yarn global add gulp

```

# gulp 常用的API

### ~~gulp.task~~
- 语法: ~~`gulp.task(name , callfun)`~~
- 作用: 创建一个基于流的任务 已经被废弃, 可以直接函数定义

### gulp.src
- 语法: `gulp.src(path)
- 作用: 找到源文件

### gulp.dest
- 语法: `gulp.dest(path)
- 作用: 将内容存放至指定目录

### gulp.watch
- 语法: `gulp.watch(path, callfun)
- 监听指定目录**path**, 监听到时执行指定函数**callfun**

### gulp.series
- 语法: `gulp.series(...tasks)
- 作用: 按顺序逐个执行**tasks**任务

### gulp.parallel
- 语法: `gulp.parallel(...tasks)
- 作用: 并行执行**tasks**任务

### pipe()
管道函数, 作用是接受当前流, 进入下一个流.
举个例子
```js
// todo
gulp.src().pipe().pipe().pipe(gulp.dest())
```

# gulp 初体验
> gulp所处理的任务大多都是以插件的形式存在的，所以在使用前，需要先安装我们需要的一些插件到项目中
```md
gulp-rename：重命名文件
gulp-concat：合并文件
gulp-filter：过滤文件
gulp-uglify：压缩Js
gulp-csso：压缩优化CSS
gulp-html-minify：压缩HTML
gulp-imagemin：压缩图片
gulp-zip:zip压缩文件
gulp-autoprefixer：自动为css添加浏览器前缀
gulp-sass：编译sass
gulp-babel：将ES6代码编译成ES5
```
## 安装插件
```
yarn add -D gulp-sass gulp-imagemin gulp-concat gulp-connect gulp-content-includer gulp-jslint gulp-minify-css gulp-uglify gulp-watch gulp-rename gulp-autoprefixer gulp-run-sequence
```
在`gulpfile.js`导入插件
```
const autoPrefixer = require("gulp-autoprefixer");
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const GulpUglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const runsequence = require('gulp-run-sequence');
const connect = require('gulp-connect');
```
## 编译css
```js
const autoPrefixer = require("gulp-autoprefixer");
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");
const { series, src, dest } = require('gulp');

async function css(){
   return src('./src/asset/style/css/**.css')
        .pipe(minifyCSS())
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 2 version'], // 兼容最新的两个版本
            cascade: false
        }))
        .pipe(rename({
            suffix: '.min' // 在文件名后添加后缀
        }))
        .pipe(dest('./dist/css'))
}

exports.css = css
```
执行`gulp css`就可以在`dist/css`看到编译压缩之后的css

## 编译 scss
**node-sass**有诸多问题, 我们选择**dart-sass**作为编译scss的插件
### 安装
```
yarn add gulp-dart-sass
```
### gulpfile.js
```
const sass = require('gulp-dart-scss');
const { series, src, dest } = require('gulp');
async function scss(){
    return src("./src/asset/style/scss/*.scss")
        .pipe(sass())
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 2 version'], // 兼容最新的两个版本
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min' // 在文件名后添加后缀
        }))
        .pipe(dest('./dist/css'))
        
}
exports.scss = scss
```
执行 `gulp scss`就可以在**dist/css**观察到效果

## 编译js

###  安装
```
yarn add -D gulp-babel gulp-uglify @babel/core @babel/presets-env
```
### 编写
```js
const babel = require("gulp-babel")
const { series, src, dest } = require('gulp');
const uglify = require("gulp-uglify");
async function js(){
    return src('./src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest("./dist/js/"))
}
exports.js = js
```

## 编译html
```js
const htmlmin = require('gulp-htmlmin')
const { series, src, dest } = require('gulp');
async function html(){
    return src("./src/pages/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true, // 移除空格和换行
            removeEmptyAttributes: true, // 移除空的原生属性
            collapseBooleanAttributes: true, // checked="checked" -> checked
            removeAttributeQuotes: true, // 当属性值只有一个时候, 移除双引号, 浏览器可以识别
            minifyCSS: true, // 压缩内嵌式css 只能基本压缩, 不能添加前缀
            minifyJS: true, // 压缩内嵌js 只能基本压缩
            removeStyleLinkTypeAttributes: true, // 移除 style 和link 标签上的 type 属性
            removeScriptTypeAttributes: true, // 移除 script 标签上 type属性
            
        }))
        .pipe(dest("./dist/pages"))
}
exports.html = html
```
# gulp 自动化
## 创建默认任务
```
const { series, src, dest, parallel } = require('gulp');
exports.default = parallel(css, scss, js, lib, images, html)
```
执行`gulp`命令就可以执行默认命令

## 创建清除任务
### 安装
```
yarn add -D gulp-clean
```
### 编写
```
const clean = require("gulp-clean")
async function cleanDist(){
    return src('./dist/**')
        .pipe(clean({force: true}))
}
exports.default = series(cleanDist , parallel(css, scss, js, lib, images, fonts, html))
```
## 启动项目
利用`webserver`来开启http
### 安装
```
yarn add -D gulp-webserver
```
### 编写
```js

```

## 配置代理
`websever` 中的 `proxies[]`配置代理
```js
proxies: [{
            source: "代理标识符",
            target: "代理目标地址"
        }]
```

## 监控文件
监控文件可以实现真正的热更新
```
const { series, src, dest, parallel, watch } = require('gulp');
const watchHandler = () => {
    watch('./src/asset/style/scss/**/*.{scss, sass}',series(['scss']))
    watch('./src/asset/style/css/**/*.css',series(['css']))
    watch('./src/js/**/*.js',series(['js']))
    watch('./src/asset/images/**/*.{jpg,png,gif}',series(['images']))
    watch('./src/pages/**/*.html',series(['html']))

}
exports.default = series(cleanDist, parallel(css, scss, js, lib, images, fonts, html),  parallel(web, watchHandler))
```
**注意link和script的引用**

## gulp 组件

使用`gulp-file-includer`在压缩html过程中自动引入一些组件形式的代码片段, 以减少代码的书写量.
### 安装
```
yarn add -D gulp-file-includer
```

### 配置
```
const fileIncluder = require('gulp-file-includer')
async function html(){
    return src("./src/pages/*.html")
        .pipe(fileIncluder({  
            prefix: "comps",// 前缀
            basePath: "./src/components/" // 组件查找的基础目录
        }))

}
```

### 语法

```
{prefix}include(path) // path是从**basePath开始查找的**
```
### 例子
向html导入压缩好的js和css

**src/components/header.html**
```
<link rel="stylesheet" href="../style/css/test.min.css">
<link rel="stylesheet" href="../style/css/base.min.css">
<script src="../js/index.js"></script>
```
**pages/index.html**
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    compsinclude("./header.html")
    <title>首页</title>
</head>
<body>
</body>
</html>
```
检查未压缩的html代码, 成功注入.

![效果图](https://files.mdnice.com/user/7673/967a62f8-669b-433c-acf2-6fe5e4947564.png)


# Todo-list

- []  重新梳理逻辑
- [] 纠正问题, 文章风格一致
- [] 使用**gulp**完成项目
