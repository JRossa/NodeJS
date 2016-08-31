 var connectionProvider = require('../db/sqliteConnectionStringProvider');

 var alarmPeriodDao = {

  createTableAlarmPeriod : function (OnSuccessCallback) {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_alarmPeriod'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_alarmPeriod" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[start] INTEGER NULL, ' +
                    '[end] INTEGER  NULL)', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_alarmPeriod' initialized.");
                        OnSuccessCallback({ status : "Finished"});
                    }
                });
            } else {
                console.log("SQL Table 'tbl_alarmPeriod' already initialized.");
            }
        }
      }); // get
    });   // serialize
  },      // createTableAlarmPeriod


  createAlarmPeriod : function (alarmPeriod, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_alarmPeriod VALUES(NULL, ?, ?)";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

          var alarmPeriodInsert = {
            start : alarmPeriod.startPeriod,
            end : alarmPeriod.endPeriod
          };

          console.log(alarmPeriodInsert);

          connection.run(insertStatement,
                  [alarmPeriodInsert.start, alarmPeriodInsert.end], function(err, row) {

                  if (err !== null) {
                      // Express handles errors via its next function.
                      // It will call the next operation layer (middleware),
                      // which is by default one that handles errors.
                      console.log(connection.run);
                      console.log(err);
                      connection.run("ROLLBACK");
                      connectionProvider.connectionStringProvider.closeConnection(connection);
                      //next(err);
                      OnErrorCallback({ error : "Action Period error !!!"});
                  }
                  else {

//                    console.log(row);
//                    console.log("val  "+this.lastID);
                    OnSuccessCallback({ status : "Successful",
                                        id : this.lastID});
                }
              });


        connection.run("COMMIT");
        connectionProvider.connectionStringProvider.closeConnection(connection);

      }); // serialize
    }     // connection
  },      // createAlarmPeriod


  getAllAlarmPeriod : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_alarmPeriod ";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

        console.log(rows);
        OnSuccessCallback(rows);
      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    } // connection
  },   // getAllAlarmPeriod


  getAlarmPeriod : function (periodId, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_alarmPeriod WHERE id = ? ";

    var periodData = {
      id : periodId
    };


    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [periodData.id], function (err, rows, fields)  {

      if (err) { throw err;}

        console.log(rows);
        OnSuccessCallback(rows);
      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    } // connection
  }   // getAlarmPeriod

}

module.exports.alarmPeriodDao = alarmPeriodDao;
