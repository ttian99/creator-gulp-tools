var spawn = require('./spawn.js');
var os = require('os');
var path = require('path');

/**
 * example:
 *    Windows - CocosCreator/CocosCreator.exe --path projectPath --build "platform=android;debug=true"
 *    Mac - /Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path projectPath --build "platform=android;debug=true"
 */
module.exports = function compileCreator(pf, cb) {
  var cmd = 'CocosCreator.exe';
  if (os.platform() === 'darwin') {
    cmd = '/Applications/CocosCreator.app/Contents/MacOS/CocosCreator';
  }
  if (os.platform() === 'win32') {
    cmd = 'CocosCreator.exe';
  }

  var projectPath = path.join(__dirname, '../../');
  var builderPath = path.join(__dirname, '../../settings/builder.json');
  var params = '"platform=' + pf + ';debug=false;configPath=' + builderPath + '"';
  var args = ['--path', projectPath, '--build', params];
  spawn(cmd, args, cb);
};
