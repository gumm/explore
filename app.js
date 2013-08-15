/**
 * Module dependencies.
 */
require('./app/public/js/closure-library/closure/goog/bootstrap/nodejs');
require('./deps.js');

goog.require('exp.settings');
goog.require('exp.WebSocket');

var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

var hskey = fs.readFileSync('./certs/explore-key.pem');
var hscert = fs.readFileSync('./certs/explore-cert.pem');
var interMediateCA = fs.readFileSync('./certs/trail-secure-server-intermediat-ca.pem');
var rootCA = fs.readFileSync('./certs/Thawte-Test-CA-Root-certificate.pem');

var options = {
    key: hskey,
    cert: hscert,
    ca: rootCA
};

//// This line is from the Node.js HTTPS documentation.
//var options = {
//  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
//  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
//};

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

var secureServer = https.createServer(options, app).listen(8888, function() {
    console.log('Express secure server listening on port ' + 8888);
});

/**
* Socket Server Setup
* @type {WebSocketServer}
*/
app.wss = new exp.WebSocket(server, app);