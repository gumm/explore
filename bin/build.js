var rootPath = require('path').resolve(__dirname, '../');
var util  = require('util');
var spawn = require('child_process').spawn;

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var buildJob = process.argv[2];
var buildParms = process.argv[3];

var build    = spawn('sh', ['bin/build/build.sh', rootPath, buildJob, buildParms]);

    build.stdout.on('data', function (data) {
      console.log('' + data);
    });

    build.stderr.on('data', function (data) {
      console.log('' + data);
    });

    build.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });
