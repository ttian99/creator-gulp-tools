var gulp = require('gulp');
var uglify = require('gulp-uglify');

/**
 * @method gulpUglify
 * @param {String|Array} srcPath 原始资源路径
 * @param {String|Array} destPath 目的路径
 * @param {Function} cb 回调函数
 */
module.exports = function gulpUglify(srcPath, destPath, cb) {
  gulp.src(srcPath)
    .pipe(uglify({
      mangle: false // 类型：Boolean 默认：true 是否修改变量名
    }))
    .pipe(gulp.dest(destPath)
      .on('end', cb));
};
