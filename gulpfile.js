// 指定一个新的 cwd (当前工作目录)
// gulp --cwd gulp-tools

var gulp = require('gulp');
var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var moment = require('moment');
var glob = require('glob');

var BUILD_PATH = '../build/web-mobile/'; // 编译完成后的路径
var DEBUG_PATH = '../build/150/'; // 150打包路径
var RELEASE_PATH = '../build/release/'; // 正式包打包路径
var TEMP_PATH = '../build-templates/web-mobile'; // 模板文件路径
var TEMP_150_PATH = '../build-templates/web-mobile-150'; // 模板文件备份路径
var TEMP_RELEASE_PATH = '../build-templates/web-mobile-release'; // 模板文件备份路径
var OPEN_PATH = '../build-templates/open'

var resMin = require('./comm/res-min');
var creatorCompile = require('./comm/creator-compile.js');
var htmlMin = require('./comm/gulp-htmlmin');
var dirZip = require('./comm/dir-zip');

// 设定cfg.js文件的debug模式
function setCfgDebugMode(isDebug) {
  var jsPath = '../assets/script/config/cfg.js';
  var str = fs.readFileSync(jsPath, { encoding: 'utf8' });
  var newStr = str.replace(/debug: [\w]{4,},/, `debug: ${isDebug},`);
  fs.outputFileSync(jsPath, newStr, { encoding: 'utf8' });
}
// 设定open/index.html的debug模式
function setOpenHtmlDebugMode(isDebug) {
  var jsPath = '../build-templates/open/index.html';
  var str = fs.readFileSync(jsPath, { encoding: 'utf8' });
  var newStr = str.replace(/var debug = [\w]{4,};/, `var debug = ${isDebug};`);
  fs.outputFileSync(jsPath, newStr, { encoding: 'utf8' });
}

// 打包编译
function stepCompile(isDebug, cb) {
  setCfgDebugMode(isDebug);
  // 拷贝template的模板
  fs.emptyDirSync(TEMP_PATH);
  if (isDebug) {
    fs.copySync(TEMP_150_PATH, TEMP_PATH);
  } else {
    fs.copySync(TEMP_RELEASE_PATH, TEMP_PATH);
  }
  creatorCompile('web-mobile', function () {
    fs.emptyDirSync(TEMP_PATH);
    setCfgDebugMode(false);
    console.info('compile over');
    cb && cb();
  });
}
// 压缩资源
function stepResMin(cb) {
  var resPath = path.join(BUILD_PATH, 'res/raw-assets/**/*.{png,jpg}');
  var tempResPath = path.join(BUILD_PATH, '../temp/res/');
  if (!fs.existsSync(tempResPath)) {
    fs.ensureDirSync(tempResPath);
  } else {
    fs.emptyDirSync(tempResPath);
  }
  resMin(resPath, tempResPath, function () {
    fs.copySync(tempResPath, BUILD_PATH + 'res/raw-assets/');
    if (fs.existsSync(tempResPath)) {
      fs.emptyDirSync(tempResPath);
    }
    cb && cb();
  }, '40-60');
}
// 合并html和min文件夹
function stepHtmlMin(cb) {
  htmlMin(BUILD_PATH, BUILD_PATH, function () {
    var mainJs = glob(BUILD_PATH + 'main.*.js', { sync: true });
    fs.removeSync(mainJs[0]);
    // var settingsJs = glob(BUILD_PATH + 'src/settings.*.js', { sync: true });
    // fs.removeSync(settingsJs[0]);
    var styleDesktopCss = glob(BUILD_PATH + 'style-desktop.*.css', { sync: true });
    fs.removeSync(styleDesktopCss[0]);
    var styleMobileCss = glob(BUILD_PATH + 'style-mobile.*.css', { sync: true });
    fs.removeSync(styleMobileCss[0]);
    var splashPng = glob(BUILD_PATH + 'splash.*.png', { sync: true });
    fs.removeSync(splashPng[0]);
    fs.removeSync(BUILD_PATH + 'tools/');
    cb && cb();
  });
}

// 打包zip
function stepZipFile(isDebug, cb) {
  var time = moment().format('YYYYMMDD-HHmmss');
  var fileName = 'bullfight-' + time + '.zip';
  var newPath = isDebug ? DEBUG_PATH : RELEASE_PATH;
  newPath = newPath + 'bullfight-' + time + '/';
  fs.mkdirSync(newPath);
  fs.copySync(BUILD_PATH, newPath + 'bullfight'); // 拷贝bullfight
  setOpenHtmlDebugMode(isDebug);
  fs.copySync(OPEN_PATH, newPath + 'open'); // 拷贝open
  setOpenHtmlDebugMode(false);
  dirZip(newPath + '**/*.*', DEBUG_PATH, fileName, cb); // 打包
}

// 取消配置为微信小游戏(已弃用)
function disableWeChatGame(cb) {
  var mainJs = glob(BUILD_PATH + 'main.*.js', { sync: true });
  var mainJsPath = mainJs[0];
  var str = fs.readFileSync(mainJsPath, { encoding: 'utf8' });
  var newStr = str.replace(/!!window\["wx"\]/, 'false');
  fs.outputFileSync(mainJsPath, newStr, { encoding: 'utf8' });
  fs.readFileSync(mainJsPath, { encoding: 'utf8' });
  cb && cb();
}

/***********************************************************
 *  gulp 任务
 ***********************************************************/
// 打包150
gulp.task('build:150', function (done) {
  async.series([
    function (cb) {
      stepCompile(true, cb);
    },
    function (cb) {
      stepResMin(cb);
    },
    function (cb) {
      stepHtmlMin(cb);
    },
    function (cb) {
      stepZipFile(true, cb);
    }
  ], function (err, results) {
    if (err) {
      console.error(new Error(err));
    }
    done && done();
  });
});
// 打包release
gulp.task('build:release', function (done) {
  async.series([
    function (cb) {
      stepCompile(false, cb);
    },
    function (cb) {
      stepResMin(cb);
    },
    function (cb) {
      stepHtmlMin(cb);
    },
    function (cb) {
      stepZipFile(false, cb);
    }
  ], function (err, results) {
    if (err) {
      console.error(new Error(err));
    }
    done && done();
  });
});
