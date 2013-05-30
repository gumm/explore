var rootPath = require('path').resolve(__dirname, '../');
var util  = require('util');
var spawn = require('child_process').spawn;

var c = {
    GREEN: '\u001b[32m',
    RED: '\u001b[31m',
    GRAY: '\u001b[90m',
    BLACK: '\u001B[30m',
    YELLOW: '\u001B[33m',
    BLUE: '\u001B[34m',
    PURPLE: '\u001B[35m',
    CYAN: '\u001B[36m',
    WHITE: '\u001B[37m',
    RESET: '\u001b[0m'
};

//process.argv.forEach(function (val, index, array) {
//  console.log(index + ': ' + val);
//});

var buildJob = process.argv[2];
var buildParms = process.argv[3];

var build = spawn('sh', ['bin/build/build.sh', rootPath, buildJob, buildParms]);

build.stdout.on('data', function (data) {
  console.log(c.GRAY + data + c.RESET);
});

build.stderr.on('data', function (data) {
  console.log(c.CYAN + data + c.RESET);
});

build.on('exit', function (code) {
  console.log(c.YELLOW + 'Child process exited with code ' + code + c.RESET);
});
