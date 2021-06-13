
const autoPrefixer = require("gulp-autoprefixer");
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");
const sass = require('gulp-dart-scss');
// const concat = require('gulp-concat');
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean")

const babel = require("gulp-babel")
const htmlmin = require('gulp-htmlmin')
const webserver = require('gulp-webserver')
const fileIncluder = require('gulp-file-includer')

const {series, parallel, src, dest, watch} = require('gulp')


// console.log(gulp); 
async function css(){
   return src('./src/asset/style/css/*.css')
        .pipe(minifyCSS())
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 2 version'], // 兼容最新的两个版本
            cascade: false
        }))
        .pipe(rename({
            suffix: '.min' // 在文件名后添加后缀
        }))
        .pipe(dest('./dist/style/css/'))
}

async function scss(){
    return src("./src/asset/style/scss/*.scss")
        .pipe(sass())
        .pipe(dest('./src/asset/style/css/')) // css 保存
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 2 version'], // 兼容最新的两个版本
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min' // 在文件名后添加后缀
        }))
        .pipe(dest('./dist/style/css/'))
        
}
// async function scss(){
//     return series(() => {
//         console.log("complier scss...");

//     }, css)
        
// }
 

async function images(){
    return src('./src/images/*.{jpg, jpeg, png, gif}')
    .pipe(imagemin())
    .pipe(dest("./dist/images/"))
}
async function js(){
    return src('./src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest("./dist/js/"))
}

async function lib(){
    return src("./src/lib/*").pipe(dest("./dist/lib/"))
}
async function fonts(){
    return src("./src/asset/fonts/*").pipe(dest("./dist/fonts/"))
}

async function html(){
    return src("./src/pages/*.html")
        .pipe(fileIncluder({
            
            prefix: "comps",// 前缀
            basePath: "./src/components/" // 组件查找的基础目录
        }))
        .pipe(htmlmin({
            // collapseWhitespace: true, // 移除空格和换行
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
function cleanDist(){
    return src('./dist/**.*')
        .pipe(clean({force: true}))
}

const web = () => {
    return src("./dist").pipe(webserver({
        host: '127.0.0.1',
        port: '8808',
        livereload: true,
        allowEmpty: true,
        open: './pages/index.html',
        
    }))
}
const watchHandler = () => {
    watch('./src/asset/style/scss/**/*.{scss, sass}',series(['scss']))
    watch('./src/asset/style/css/**/*.css',series(['css']))
    watch('./src/js/**/*.js',series(['js']))
    watch('./src/asset/images/**/*.{jpg,png,gif}',series(['images']))
    watch('./src/pages/**/*.html',series(['html']))

}

exports.css = css
exports.images = images
exports.js = js
exports.html = html
exports.scss = scss
exports.lib = lib
exports.fonts = fonts
exports.default = series(cleanDist, parallel(css, scss, js, lib, images, fonts, html),  parallel(web, watchHandler))