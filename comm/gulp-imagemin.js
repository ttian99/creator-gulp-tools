var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var pngquant = require('imagemin-pngquant');
var mozjpeg = require('imagemin-mozjpeg');

module.exports = function gulpImagemin(srcGlob, destPath, opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    var plugins = [
        pngquant({
            quality: opts.pngQuality || '50'
        }),
        mozjpeg({
            quality: opts.jpgQuality || '70'
        })
    ];

    if (opts.cache === false) {
        gulp.src(srcGlob, { base: opts.base })
            .pipe(imagemin(plugins))
            .pipe(gulp.dest(destPath))
            .on('end', cb);
    } else {
        gulp.src(srcGlob, { base: opts.base })
            .pipe(cache(imagemin(plugins)))
            .pipe(gulp.dest(destPath))
            .on('end', cb);
    }
};