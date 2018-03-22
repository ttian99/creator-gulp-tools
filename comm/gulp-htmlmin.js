var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var fileInline = require('gulp-file-inline');

/**
 * @method gulpHtmlmin 合并js，css到html
 *
 * @param {String} src html文件路径
 * @param {String} dest html目标路径
 * @param {Function} cb 回调函数
 */
module.exports = function gulpHtmlmin(src, dest, cb) {
  var opts = {
    removeComments: true, // 清除HTML注释
    collapseWhitespace: true, // 压缩HTML
    collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
    // removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
    // removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
    // removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
    minifyJS: true, // 压缩页面JS
    minifyCSS: true // 压缩页面CSS
  };

  gulp.src(src + '*.html')
    .pipe(fileInline({
      js: {
        filter: function(tag) {
          return tag.indexOf('data-inline="true"') > 0;
        },
        minify: true
      }
    }))
    .pipe(htmlmin(opts))
    .pipe(gulp.dest(dest)
      .on('end', cb));
};
