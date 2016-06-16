var mysql = require('mysql');

var mysqlConnectionString = require('./mysqlConnectionString');

var mysqlConnectionStringProvider =  {

  getMySqlConnection: function () {

    var connection = mysql.createConnection(mysqlConnectionString.mysqlConnectionString.connection.dev);

    connection.connect( function (err) {

      if (err) { thow err;}

      console.log('Connected Successefully !!');

    });

    return connection;
  }

  closeMySqlConnection: function (currentConnection) {

    if (currentConnection) {

      currentConnection.end( function (err) {
        if (err) { thow err;}

        console.log('Connection Closed Successefully !!');
      });
    }
  }
}

module.exports.mysqlConnectionStringProvider = mysqlConnectionStringProvider;
