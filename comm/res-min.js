var gulp = require('gulp');
var gulpPngquant = require('gulp-pngquant');
var gulpCache = require('gulp-cache');

/**
 * @method resMin 压缩图片资源
 *
 * @param {String} srcPath 资源路径
 * @param {String} srcPath 目标路径
 * @param {Function} cb 回调函数
 * @param {String|Number} percent  图片品质
 */
function resMin(srcPath, destPath, cb, percent) {
  percent = percent || '40-60';
  gulp.src(srcPath)
    .pipe(gulpCache(gulpPngquant({
      quality: percent
    })))
    .pipe(gulp.dest(destPath))
    .on('end', cb);
};

var imgquant = require('./gulp-imgquant.js');
function resMin2(srcPath, destPath, cb, percent) {
  percent = percent || '40-60';
  gulp.src(srcPath)
    .pipe(imgquant({
      quality: percent
    }))
    .pipe(gulp.dest(destPath))
    .on('end', cb);
};

var gulpImagemin = require('./gulp-imagemin');
function resMin3 (srcPath, destPath, cb, percent){
  var opt = {
    cache: true,
    pngQuality: percent || '50',
    jpgQuality: '70'
  };
  gulpImagemin(srcPath, destPath, opt, cb);
}

module.exports = resMin3
