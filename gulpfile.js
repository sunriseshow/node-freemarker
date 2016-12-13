var gulp= require("gulp");
var path = require('path');
var
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    postcss = require('gulp-postcss'),
    px2rem = require('postcss-px2rem'),
    htmlBase64 = require('gulp-img64'),
    plumber = require('gulp-plumber');
var freemarker = require('gulp-freemarker');
var changed = require('gulp-changed');
var replace = require('gulp-replace');
var BASE_PATH = __dirname + '/';
var PAGES_PATH = 'views';
var pagesout="output";
var OUT_PATH = 'html';


var freemarkgulp = {
    paths: {
        base: BASE_PATH,
        output: OUT_PATH,
        pages: PAGES_PATH,
        viewRoot:path.join(BASE_PATH, pagesout).replace(/\\/g, '/'),
        ftl: './' + PAGES_PATH + '/*.ftl',
        mock: './mock/*.json'

    }
}
console.log(freemarkgulp.paths.mock);
gulp.task('praseFTL', function () {
    gulp.src(freemarkgulp.paths.mock)
        .pipe(changed(freemarkgulp.paths.output))
        .pipe(freemarker({
            viewRoot: freemarkgulp.paths.viewRoot,
            options: {}
        }))
        .pipe(gulp.dest(freemarkgulp.paths.output));
})
gulp.task('templates', function(){
    gulp.src(freemarkgulp.paths.ftl)
        .pipe(replace('${mobile.css.host.url}', 'localhost'))
        .pipe(gulp.dest('output'));
});
//【1】CSS任务：此任务最终生成一个 xxx.css文件和一个压缩文件 xxx.min.css
gulp.task('css', function () {
    var processors = [
        px2rem({remUnit: 50}),
        //自动补全
        autoprefixer
    ];
    //先编译
    return gulp.src(['./sass/*.scss','./sass/**/*.scss'])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(cssBase64(config.options))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.reload({stream: true}));
});
//【3】 Images  图片处理压缩
var pngquant=require("imagemin-pngquant");              // png
var imageminMozjpeg = require('imagemin-mozjpeg');     // jpg
gulp.task('image', function() {
    return gulp.src('transtion/**')   // 对GIF效果不明显，对jpg、png压缩很有效果
        .pipe(  imagemin({
            optimizationLevel:6,  // 数字越大，表示压缩程度越大,默认为3
            progressive: false,  // false表示压缩jpg
            interlaced: false,  // false表示压缩gif
            multipass:true,    // 最大程度优化SVG
            svgPlugins:[{removeViesBox:false}],    // 不去除SVG的 viewBox
            use:[pngquant(),imageminMozjpeg({quality: 80})]  //使用基于imagemin的插件
        }))
        .pipe(gulp.dest('images'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({ message: 'imagesNew 完成' }));
});

// 【4】自动刷新浏览器
var fs= require("fs");  // 不需要安装，是node的核心模块
//gulp.task('browserSync',["css",'image'], function() {
//    browserSync.init({
//        files: './html/*.html',
//        server: {
//            baseDir: "."
//        },    //设置server，（则不能再设置proxy），此时启动浏览器URL为 http://localhost:3000/
//        rewriteRules: [
//            {
//                match: /<!--#include virtual="(.+)"-->/g,
//                fn: function (match, filename) {
//                    if (fs.existsSync("src/"+filename)) {
//                        return fs.readFileSync("src/"+filename);
//                    } else {
//                        return '<span style="color: red">'+filename+' could not be found</span>';
//                    }
//                }
//            }
//        ],
//        open: "external",
//        // proxy:"localhost:803/try/try-pc/v4.0/src"   // 此时启动浏览器URL为 http://localhost:3000/try/try-pc/v4.0/src/
//        // port:1000,
//        browser: "chrome"
//
//    });
//
//
//    //gulp.watch(["src/js/**/*.js"], ['js']);
//    gulp.watch('transtion/**', ['image']);
//    //gulp.watch(["src/sass/**/*.scss"],['css']);
//    gulp.watch(["sass/**/*.scss",'images/**'],['css']);
//    gulp.watch(["html/*.html","html/*.*"]).on('change', browserSync.reload);
//});


//代理
gulp.task('browserSyncproxy',["templates","praseFTL"], function() {
    browserSync.init({
        files: './html/*.html',
        server: {
            baseDir: "./html"
        },
        //proxy: {
        //    host: 'localhost',
        //    port: '8000'
        //},
        //proxy:"localhost:810/try/try-mobile/v2.1/src",
        // proxy:"localhost:803/try/try-pc/v4.0/src"   // 此时启动浏览器URL为 http://localhost:3000/try/try-pc/v4.0/src/

        open: "external",
        browser: "chrome"

    });



    gulp.watch('./transtion/**', ['image']);
    //gulp.watch(["src/sass/**/*.scss"],['css']);
    gulp.watch(["./sass/**/*.scss",'./images/**'],['css']);
    gulp.watch(["./views/*.ftl"],['praseFTL']);
    gulp.watch(["./views/*.ftl","./js/**/*.js"]).on('change', browserSync.reload);
});






// 【7】 把图片转化为 base64
var cssBase64 = require('gulp-base64');  //	将CSS的background的URL()转换为base64,,如果本书已经是base64了，则不转换
var config = {
    src: 'src/css/*.css',
    dest: 'src/css',
    options: {
        baseDir: '',
        extensions: ['svg', 'png', "jpg"],
        maxImageSize: 3.5 * 1024,  //转化的尽量少于3.5k
        debug: true
    }
};
gulp.task('cssBase64', function() {
    return gulp.src(config.src)
        .pipe(cssBase64(config.options))
        .pipe(gulp.dest(config.dest));
});
   //	将HTML的img标签的<img src=""/>转换为base64,如果已经是base64了，则不转换
gulp.task('htmlBase64', function () {
    gulp.src(["src/**/*.html"])
        .pipe(htmlBase64())
        .pipe(gulp.dest('src'));
});










//【11】默认任务
gulp.task('default', function() {
    gulp.start('browserSyncproxy');
});
// 开发的时候,运行GULP默认任务：
//gulp
//执行其它任务，就要关闭gulp任务，然后单独执行，如下：
//gulp clean
//gulp cssBase64
//gulp htmlBase64
//gulp toWebp
//gulp spritesmith1
//gulp spritesmith2A
//gulp spritesmith2B
//gulp spritesmith3
//gulp jsTest