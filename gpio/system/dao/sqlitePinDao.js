var connectionProvider = require('../db/sqliteConnectionStringProvider');

var pinDao = {


  createTable : function () {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_pin'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_pin" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[bcm] INTEGER UNIQUE NULL, ' +
                    '[board] INTEGER UNIQUE NULL, ' +
                    '[sensor_id] INTEGER UNIQUE NULL, ' +
                    '[input] BOOLEAN NULL, ' +
                    '[used] BOOLEAN  NULL, ' +
                    '[warn] BOOLEAN  NULL, ' +
                    '[alarm_duration] INTEGER NULL, ' +
                    'FOREIGN KEY(sensor_id) REFERENCES tbl_sensor(id))', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_pin' initialized.");
                    }
                });
            } else {
                console.log("SQL Table 'tbl_pin' already initialized.");
            }
        }
      }); // get

    }); // serialize

  },

  createPin : function (pinData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_pin VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)";

    var pinInsert = {
      bcm : pinData.pinBCM,
      board : pinData.pinBOARD,
      sensorId : pinData.pinSensorId,
      input : pinData.pinInput,
      used : pinData.pinUsed,
      warn : pinData.pinWarn,
      alarmDuration : pinData.pinAlarmDuration
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [pinInsert.bcm, pinInsert.board, pinInsert.sensorId,
                  pinInsert.input, pinInsert.used, pinInsert.warn,
                  pinInsert.alarmDuration], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Pin already exists !!!"});
                }
                else {
                  connection.run("COMMIT");
                  connectionProvider.connectionStringProvider.closeConnection(connection);

//                  console.log(row);
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      }); // serialize
    } // connection
  }, // createPin

  updatePin : function (pinData, OnSuccessCallback, OnErrorCallback) {

    var updateStatement = "UPDATE tbl_pin SET bcm = ?, board = ?, sensor_id = ?, " +
                          "input = ?, used = ?, warn = ?, alarm_duration = ? " +
                          "WHERE id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    var pinUpdate = {
      id : pinData.pinId,
      bcm : pinData.pinBCM,
      board : pinData.pinBOARD,
      sensorId : pinData.pinSensorId,
      input : pinData.pinInput,
      used : pinData.pinUsed,
      warn : pinData.pinWarn,
      alarmDuration : pinData.pinAlarmDuration
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(updateStatement,
                [pinUpdate.bcm, pinUpdate.board, pinUpdate.sensorId,
                 pinUpdate.input, pinUpdate.used, pinUpdate.warn,
                 pinUpdate.alarmDuration,
                 pinUpdate.id], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Sensor already exists !!!"});
                }
                else {
                  connection.run("COMMIT");
                  connectionProvider.connectionStringProvider.closeConnection(connection);
//                  console.log(row);
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      }); // serialize
    } // connection
  }, // updatePin

  deletePin : function (pinId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_pin WHERE id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    console.log("ligação  " + pinId);

    var pinDelete = {
      id : pinId
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(deleteStatement,
                [pinDelete.id], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Pin already exists !!!"});
                }
                else {
                  connection.run("COMMIT");
                  connectionProvider.connectionStringProvider.closeConnection(connection);
//                  console.log(row);
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      }); // serialize
    } // connection
  }, // deletePin

  getAllPin : function (OnSuccessCallback) {

    var insertStatement = "SELECT * FROM tbl_pin ORDER BY id ";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(insertStatement, [], function (err, rows, fields)  {

      if (err) {
        throw err;
      }

        // convert boolean 0 -> false & 1 -> true
        for (row in rows) {
          console.log(rows[row].input);
          rows[row].input  = (rows[row].input == 0)? false: true;
          rows[row].used  = (rows[row].used == 0)? false: true;
        }

        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }

}

module.exports.pinDao = pinDao;
