var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'explore';

/* establish the database connection */
var db = new MongoDB(
  dbName,
  new Server(dbHost, dbPort, {auto_reconnect: true}),
  {w: 1}
);
db.open(function(e, d) {
  if (e) {
    console.log(e);
  } else {
    console.log('connected to database :: ' + dbName);
  }
});

module.exports = {
  accounts: db.collection('accounts'),
  orgs: db.collection('orgs')
};
