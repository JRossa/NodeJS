var connectionString = require('./sqliteConnectionString');


var sqliteInit = {

  dbName: connectionString.connectionString.connection.dev.dbName,

  dbCreate: function () {

    var fs = require("fs");

    var fileName = this.dbName;

    var exists = fs.existsSync(fileName);

    if(!exists) {
      console.log("Creating DB file.");
      fs.openSync(fileName, "w");
    } else {
      console.log("DB file already created.");
    }
  }

};


module.exports = sqliteInit;
