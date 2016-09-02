// https://www.npmjs.com/package/mysql
var mysql = require('mysql');

var connectionString = require('./mysqlConnectionString');

var connectionStringProvider =  {

  getConnection: function () {

    var connection = mysql.createConnection(connectionString.connectionString.connection.dev);

    connection.connect( function (err) {

      // it prints a lot of information
      // console.log(connection);

      if (err) {
        console.log('Connection problem !! !!' + err);
        throw err;
      }

    });

    console.log('Connected Successefully !!');

    return connection;
  },

  closeConnection: function (currentConnection) {

    if (currentConnection) {

      currentConnection.end( function (err) {
        if (err) {
          throw err;
        }

        console.log('Connection Closed Successefully !!');
      });
    }
  }

};


module.exports.connectionStringProvider = connectionStringProvider;
