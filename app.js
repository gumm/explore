/**
 * Module dependencies.
 */
require('./app/public/js/closure-library/closure/goog/bootstrap/nodejs');
require('./deps.js');

goog.require('exp.settings');

var express = require('express');
var http = require('http');
//var settings = require('./app/config/settings');
var ExploreWebSocket = require('./app/src/websocket');

var dev = false;
if (process.argv[2] === 'dev') {
    dev = true;
}

process.argv.forEach(function(val, index) {
  console.log(index + ': ' + val);

});

/**
 * App Setup
 */
var app = exp.settings.configure(express(), express, dev);


/**
* Server Setup
* @type {*|http.Server|http.Server|goog.events.Key}
*/
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

/**
* Socket Server Setup
* @type {WebSocketServer}
*/
app.wss = new ExploreWebSocket(server, app);


