/*jslint node: true */
/*jshint strict:false */
'use strict';

var errorHdlr = require('../utils/utilErrorHandler');
var connectionProvider = require('../db/sqliteConnectionStringProvider');

var sensorDao = {


  createTable : function () {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');

    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_sensor'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_sensor" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[num] INTEGER  UNIQUE NULL, ' +
                    '[type_id] INTEGER  NULL, ' +
                    '[location] VARCHAR(50)  NULL)', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_sensor' initialized.");
                    }
                });
            } else {
                console.log("SQL Table 'tbl_sensor' already initialized.");
            }
        }
      }); // get
    });   // serialize
  },      // createTable


  createSensor : function (sensorData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_sensor VALUES(NULL, ?, ?, ?)";

    var sensorInsert = {

      number : sensorData.sensorNumber,
      typeId : sensorData.sensorTypeId,
      location : sensorData.sensorLocation
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();


    if (connection) {

      var errorLst = [];

      connection.on('trace', function (data) {
//        console.log(data);
        errorLst.push(data);
      });

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [sensorInsert.number, sensorInsert.typeId, sensorInsert.location], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    connection.run("ROLLBACK");
//                    console.log(insertStatement);
//                    console.log(err);
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    err.errPlace = "Run";
                    err.errorLst = errorLst;
//                    OnErrorCallback({ error : "Sensor already exists !!!"});
//                    throw err;

              } else {
                  connection.run("COMMIT");
                  connectionProvider.connectionStringProvider.closeConnection(connection);

//                  console.log(row);
                  OnSuccessCallback({ status : "Successful"});
              }

              // https://docs.nodejitsu.com/articles/errors/what-are-the-error-conventions/
              if (err !== null) {

                setTimeout( function() {
                  var error = errorHdlr.errorHandler(err);
                  OnErrorCallback(error);
                }, 200);
              }

          });
      }); // serialize
    }     // connection
  },      // createSensor


  updateSensor : function (sensorData, OnSuccessCallback, OnErrorCallback) {

    var updateStatement = "UPDATE tbl_sensor SET num = ?, type_id = ?, location = ? " +
                          "WHERE id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    var sensorUpdate = {
      id : sensorData.sensorId,
      number : sensorData.sensorNumber,
      typeId : sensorData.sensorTypeId,
      location : sensorData.sensorLocation
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(updateStatement,
                [sensorUpdate.number, sensorUpdate.typeId,
                 sensorUpdate.location, sensorUpdate.id], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Sensor update error !!!"});
                }
                else {
                  connection.run("COMMIT");
                  connectionProvider.connectionStringProvider.closeConnection(connection);
//                  console.log(row);
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      }); // serialize
    }     // connection
  },      // updateSensor


  deleteSensor : function (sensorId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_sensor WHERE id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    console.log("ligação  " + sensorId);

    var sensorDelete = {
      id : sensorId
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(deleteStatement,
                [sensorDelete.id], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Sensor delete error !!!"});
                }
                else {
                  connection.run("COMMIT");
                  connectionProvider.connectionStringProvider.closeConnection(connection);
//                  console.log(row);
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      }); // serialize
    }     // connection
  },      // deleteSensor

  deleteSensorByTypeId : function (sensorTypeId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_sensor WHERE type_id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    console.log("ligação  " + sensorTypeId);

    var sensorDelete = {
      typeId : sensorTypeId
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(deleteStatement,
                [sensorDelete.typeId], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Sensor delete error !!!"});
                }
                else {
                  connection.run("COMMIT");
                  connectionProvider.connectionStringProvider.closeConnection(connection);
//                  console.log(row);
                  OnSuccessCallback({ status : "Successful"});
              }
            });
      });  // serialize
    }      // connection
  },       // deleteSensorByTypeId


  getAllSensor : function (OnSuccessCallback) {

//    console.log("Config: getAllSensor");

    var selectStatement = "SELECT a.id, a.num, a.type_id, a.location, b.model " +
                          "FROM tbl_sensor AS a, tbl_sensorType AS b " +
                          "WHERE a.type_id = b.id ORDER BY a.id";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },  // getAllSensor


  getSensorById : function (sensorId, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_sensor WHERE Id = ?";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [sensorId], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }  // getSensorById

};


module.exports.sensorDao = sensorDao;
