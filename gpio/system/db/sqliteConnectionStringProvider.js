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
    console.log('Connected Successefully !!');

    return connection;
  },


  closeConnection: function (currentConnection) {

    currentConnection.close();
  }

}

module.exports.connectionStringProvider = connectionStringProvider;
