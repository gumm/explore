/**
 * Module dependencies.
 */
require('./app/public/js/closure-library/closure/goog/bootstrap/nodejs');
require('./deps.js');

goog.require('exp.settings');
goog.require('exp.WebSocket');

var https = require('https');
var http = require('http');
var fs = require('fs');

var express = require('express');


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
var explore = exp.settings.configure(express(), express, dev);

/**
  * Server Setup
  * @type {*|http.Server|http.Server|goog.events.Key}
  */
var server = http.createServer(explore).listen(explore.get('port'), function() {
    console.log('Express server listening on port ' + explore.get('port'));
});

/**
 * Socket Server Setup
 * @type {WebSocketServer}
 */
explore.wss = new exp.WebSocket(server, explore);


