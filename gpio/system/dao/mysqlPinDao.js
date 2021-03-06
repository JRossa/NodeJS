/*jslint node: true */
/*jshint strict:false */
'use strict';

var connectionProvider = require('../db/mysqlConnectionStringProvider');

var pinDao = {


  createTable : function () {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_pin"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_pin' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_pin' +
                '(id INTEGER NOT NULL AUTO_INCREMENT,' +
                'bcm INTEGER UNIQUE NOT NULL,' +
                'board INTEGER UNIQUE NOT NULL,' +
                'sensor_id INTEGER NULL,' +
                'input BOOLEAN NULL,' +
                'used BOOLEAN NULL,' +
                'warn BOOLEAN NULL,' +
                'alarm_duration TIME NULL,' +
                'PRIMARY KEY(id),' +
                'INDEX FK_tbl_pin_tbl_sensor (sensor_id),' +
                'CONSTRAINT FK_tbl_pin_tbl_sensor FOREIGN KEY (sensor_id) ' +
                'REFERENCES tbl_sensor (id) ON UPDATE NO ACTION ON DELETE NO ACTION)', function (err) {

              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_pin' initialized.");
              }
            }); // Create Table
          }
        }

        connectionProvider.connectionStringProvider.closeConnection(connection);
      }); // query
    }     // connection
  },      // createTable


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

//    console.log(pinInsert);

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(insertStatement,
                [pinInsert.bcm, pinInsert.board, pinInsert.sensorId,
                  pinInsert.input, pinInsert.used, pinInsert.warn,
                  pinInsert.alarmDuration], function(err, row) {

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
                    OnErrorCallback({ error : "Pin already exists !!!"});
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
                  OnSuccessCallback({ status : "Successful"});
              }
          });
      }); // beginTransation
    }     // connection
  },      // createPin


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

      connection.beginTransaction(function(err) {
        connection.query(updateStatement,
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
                    connection.rollback(function() {
                      throw err;
                    });
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Pin update error !!!"});
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
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      }); // beginTransaction
    }     // connection
  },      // updatePin


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

      connection.beginTransaction(function(err) {
        connection.query(deleteStatement,
                [pinDelete.id], function(err, row) {

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
                    OnErrorCallback({ error : "Pin delete error !!!"});
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
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      }); // beginTransaction
    }     // connection
  },      // deletePin


  getAllPin : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_pin ORDER BY id ";


    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [], function (err, rows, fields)  {

        if (err) {
          throw err;
        }

      // convert boolean 0 -> false & 1 -> true

      for (var row in rows) {
//        console.log(rows[row].input);
        rows[row].input  = (rows[row].input === 0)? false: true;
        rows[row].used  = (rows[row].used === 0)? false: true;
        rows[row].warn  = (rows[row].warn === 0)? false: true;
      }

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },   // getAllPin


  getAllInputPin : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_pin WHERE input = true ORDER BY id ";


    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [], function (err, rows, fields)  {

        if (err) {
          throw err;
        }

      // convert boolean 0 -> false & 1 -> true

      for (var row in rows) {
//        console.log(rows[row].input);
        rows[row].input  = (rows[row].input === 0)? false: true;
        rows[row].used  = (rows[row].used === 0)? false: true;
        rows[row].warn  = (rows[row].warn === 0)? false: true;
      }

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },   // getAllInputPin


  getPinByBOARD : function (pinBOARD, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_pin WHERE board = ? ORDER BY id ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [pinBOARD], function (err, rows, fields)  {

        if (err) {
          throw err;
        }
        // convert boolean 0 -> false & 1 -> true

        for (var row in rows) {
//          console.log(rows[row].input);
          rows[row].input  = (rows[row].input === 0)? false: true;
          rows[row].used  = (rows[row].used === 0)? false: true;
          rows[row].warn  = (rows[row].warn === 0)? false: true;
        }
//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },  // getPinByBOARD


  getOutputPin : function (warnOption, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_pin " +
                          "WHERE used = true AND input = false AND warn = ? " +
                          "ORDER BY id ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [warnOption], function (err, rows, fields)  {

        if (err) {
          throw err;
        }
        // convert boolean 0 -> false & 1 -> true

        for (var row in rows) {
//          console.log(rows[row].input);
          rows[row].input  = (rows[row].input === 0)? false: true;
          rows[row].used  = (rows[row].used === 0)? false: true;
          rows[row].warn  = (rows[row].warn === 0)? false: true;
        }
//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }  // getOutputPin

};


module.exports.pinDao = pinDao;
