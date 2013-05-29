var settings = require('./etc/settings');
var util  = require('util');
var spawn = require('child_process').spawn;
var ls    = spawn('ls', ['-lh', '/usr']); // the second arg is the command
                                          // options

    ls.stdout.on('data', function (data) {    // register one or more handlers
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });
