var spawn = require('child_process').spawn;
var iconv = require('iconv-lite');

module.exports = function innerSpawn(cmd, args, opts, cb) {
  if (typeof (opts) === 'function') {
    cb = opts;
    opts = {};
  }
  var ls = spawn(cmd, args, opts);

  ls.stdout.on('data', function (data) {
    console.log(iconv.decode(data, 'gbk'));
  });

  ls.stderr.on('data', function (data) {
    console.log(iconv.decode(data, 'gbk').red);
  });

  ls.on('exit', function (code) {
    cb(null, code);
  });
};
