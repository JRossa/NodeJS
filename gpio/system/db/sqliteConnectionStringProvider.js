var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

var connectionStringProvider = {

  getConnection: function () {

    var connectionString = require('./sqliteConnectionString');

    var exists = fs.existsSync(connectionString.connectionString.connection.dev.dbName);

    if (!exists) {
       throw "File does not exist !!";
    }

    var connection = new sqlite3.Database(connectionString.connectionString.connection.dev.dbName);
//    var connection = new sqlite3.Database(':memory:');
//    connection.configure('busyTimeout', 10000);
/*
    connection.run('PRAGMA busy_timeout=10000', [], function(err, row) {

      if (err !== null) {
        console.log("Error : " + err);
      } else {
        console.log("OK : PRAGMA busy_timeout=10000");
      }
    });

    connection.run('PRAGMA journal_mode=WAL', [], function(err, row) {

      if (err !== null) {
        console.log("Error : " + err);
      } else {
        console.log("OK : PRAGMA journal_mode=WAL");
      }
    });
*/
    console.log('Connected Successefully !!');

    return connection;
  },


  closeConnection: function (currentConnection) {

    currentConnection.close();
  }

};


module.exports.connectionStringProvider = connectionStringProvider;
