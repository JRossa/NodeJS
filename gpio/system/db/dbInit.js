var fs = require("fs");
var connectionString = require('./sqliteConnectionString');


var dbInit = {

    dbName: connectionString.connectionString.connection.dev.dbName,

    dbCreate: function () {

        var fileName = this.dbName;

        var exists = fs.existsSync(fileName);

        if(!exists) {
            console.log("Creating DB file.");
            fs.openSync(fileName, "w");
        } else {
            console.log("DB file already created.");
        }
      }

}

module.exports = dbInit;
