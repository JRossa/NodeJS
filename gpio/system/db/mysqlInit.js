var connectionString = require('./mysqlConnectionString');


var sqliteInit = {

    dbName: connectionString.connectionString.connection.dev.dbName,

    dbCreate: function () {

      var connection = mysql.createConnection(mysqlConnectionString.mysqlConnectionString.connection.dev);

      connection.connect( function (err) {

        if (err) {

          thow err;
        }

        console.log('Connected Successefully !!');

        if(!exists) {
            console.log("Creating DB file.");
            fs.openSync(fileName, "w");
        } else {
            console.log("DB file already created.");
        }
      }

}

module.exports = sqliteInit;
