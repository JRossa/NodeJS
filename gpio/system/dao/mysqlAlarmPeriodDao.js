var connectionProvider = require('../db/mysqlConnectionStringProvider');

var alarmPeriodDao = {


  createTableAlarmPeriod : function () {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_alarmPeriod"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_alarmPeriod' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_alarmPeriod' +
                '(id INTEGER NOT NULL AUTO_INCREMENT,' +
                'start TIME NULL,' +
                'end TIME NULL)', function (err) {

              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_alarmPeriod' initialized.");
              }
            }); // Create Table
          }
        }

        onnectionProvider.connectionStringProvider.closeConnection(connection);

      }); // query
    }     // connection
  },      // createTableAlarmPeriod


  createAlarmPeriod : function (alarmPeriod, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_alarmPeriod VALUES(NULL, ?, ?)";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {

        var alarmPeriodInsert = {
          start : alarmPeriod.startPeriod,
          end : alarmPeriod.endPeriod
        };

        console.log(alarmPeriodInsert);

        connection.query(insertStatement,
                [actionTypeInsert.type, actionTypeInsert.description], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(err);
                    connection.rollback(function() {
                      throw err;
                    });
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Action Type Error !!!"});
                }
                else {
                  connection.commit(function(err) {
                    if (err) {
                      return connection.rollback(function() {
                        throw err;
                      });
                    }
                  });
                  connectionProvider.connectionStringProvider.closeConnection(connection);
//                  console.log(row);
                  OnSuccessCallback({ status : "Successful",
                                      id : this.lastID});
                }
            });
      });     // beginTransation
    }         // connection
  },          // createAlarmPeriod


  getAlarmPeriod : function (periodId, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_alarmPeriod WHERE id = ? ";

    var periodData = {
      id : periodId
    };


    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [periodData.id], function (err, rows, fields)  {

      if (err) {
        console.log(err);
        throw err;
      }

//      console.log(rows);
      OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }    // getAlarmPeriod


}


module.exports.alarmPeriodDao = alarmPeriodDao;
