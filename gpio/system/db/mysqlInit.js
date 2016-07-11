var connectionString = require('./mysqlConnectionString');


var mysqlInit = {

    dbCreate: function () {

      var mysql = require('mysql');

/*
      createStatement = 'CREATE DATABASE IF NOT EXISTS ' +
                        connectionString.connectionString.connection.dev.database;
      connection.query('CREATE DATABASE IF NOT EXISTS gpio', function (err) {
        if (err) {
          throw err;
        }
        useStatement = 'USE ' +
                       connectionString.connectionString.connection.dev.database;
        connection.query(useStatement, function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        });   // Use Database
      });       // Create Database
*/

      connString = {
        host: connectionString.connectionString.connection.dev.host,
        user: connectionString.connectionString.connection.dev.user,
//        database : connectionString.connectionString.connection.dev.database,
        password : connectionString.connectionString.connection.dev.password

      }

      var connection = mysql.createConnection(connString);

      connection.connect( function (err) {

        if (err) {
          throw err;
        }

        if (connection) {

          console.log('Connected Successefully !!');

          selectStatement = "SHOW DATABASES;"
          connection.query(selectStatement, [], function (err, result) {

            if (err) {
              throw "Show DB - Query error"
            }

            exists = false;
            dbName = connectionString.connectionString.connection.dev.database;

//            console.log(result);
//            console.log(dbName);

            result.forEach( function (db) {
//              console.log(db.Database);
              if (db.Database === dbName) {
                exists = true;
                return;
              }
            });

            if(!exists) {
              console.log("Creating DB file.");
              createStatement = "CREATE DATABASE " + dbName + ";"

              connection.query(createStatement, [], function (err, result) {

              if (err) {
                throw "Creating DB - Query error"
              }

              console.log('Creating DB Successefully !!');

            });
            } else {
              console.log("DB file already created.");
            }

          });
        }     // connection

      });
    }
}

module.exports = mysqlInit;
