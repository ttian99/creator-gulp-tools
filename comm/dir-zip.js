var gulp = require('gulp');
var gulpZip = require('gulp-zip');

/**
 * @method dirZip 打包zip包
 *
 * @param {String} srcPath 压缩包资源路径
 * @param {String} destPath 压缩包目的路径
 * @param {String} zipName 压缩包名称
 * @param {Function} cb 回调函数
 */
module.exports = function dirZip(srcPath, destPath, zipName, cb) {
  gulp.src(srcPath)
    .pipe(gulpZip(zipName))
    .pipe(gulp.dest(destPath))
    .on('end', cb);
};
