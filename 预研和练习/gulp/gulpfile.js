// 获取 gulp
var gulp = require('gulp');

// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
//var cssUglify = require('gulp-minify-css');
var imageMin = require('gulp-imagemin');

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
// gulp.task('script', function() {
//     // 1. 找到文件
//     gulp.src('js/*.js')
//     // 2. 压缩文件
//         .pipe(uglify({ mangle: false }))
//     // 3. 另存压缩后的文件
//         .pipe(gulp.dest('dist/js'))
// })

// gulp.task('auto',function(){
//     gulp.watch('js/*.js',['script']);
//     gulp.watch('css/*.css', ['css']);
//     gulp.watch('images/*.*', ['image'])
// })

/*gulp.task('css',function(){
    gulp.src('css/*.css')
        .pipe(cssUglify())
        .pipe(gulp.dest('dist/css'))
})*/

gulp.task('image',function(){
    gulp.src('images/*.*')
        .pipe(imageMin({
          optimizationLevel: 1, //类型：Number  默认：3  取值范围：0-7（优化等级）
          progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
          interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
          multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('default',['image'])