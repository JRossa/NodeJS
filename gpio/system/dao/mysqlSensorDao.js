/*jslint node: true */
/*jshint strict:false */
'use strict';

var errorHdlr = require('../utils/utilErrorHandler');
var connectionProvider = require('../db/mysqlConnectionStringProvider');

var sensorDao = {

  createTable : function () {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_sensor"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_sensor' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_sensor' +
                 '(id INTEGER NOT NULL AUTO_INCREMENT,' +
                 'num INTEGER UNIQUE NOT NULL,' +
                 'type_id INTEGER NOT NULL,' +
                 'location VARCHAR(50) NULL,' +
                 'PRIMARY KEY(id),' +
                 'INDEX FK_tbl_sensor_tbl_sensorType (type_id),' +
                 'CONSTRAINT FK_tbl_sensor_tbl_sensorType FOREIGN KEY (type_id) ' +
                 'REFERENCES tbl_sensorType (id) ON UPDATE NO ACTION ON DELETE NO ACTION)', function (err) {

              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_sensor' initialized.");
              }
            }); // Create Table
          }
        }

        connectionProvider.connectionStringProvider.closeConnection(connection);
      }); // query
    }     // connection
  },      // createTable


  createSensor : function (sensorData, OnSuccessCallback, OnErrorCallback) {

    var error = null;

    var insertStatement = "INSERT INTO tbl_sensor VALUES(NULL, ?, ?, ?)";

    var sensorInsert = {

      number : sensorData.sensorNumber,
      typeId : sensorData.sensorTypeId,
      location : sensorData.sensorLocation
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction( function(err) {
        var query = connection.query(insertStatement,
                [sensorInsert.number, sensorInsert.typeId, sensorInsert.location], function(err, row) {


            if (err !== null) {
                // Express handles errors via its next function.
                // It will call the next operation layer (middleware),
                // which is by default one that handles errors.
                console.log(query.sql);
                console.log(err);
                error = err;
                connection.rollback( function(errRoll) {
//                  callback(new Error('something bad happened'));
//return log("Query failed. Error: %s. Query: %s", err, query);
                    if (errRoll !== null) {
//                      connectionProvider.connectionStringProvider.closeConnection(connection);
                      err.errPlace = "Rollback";
                      err.errRoll = errRoll;
                      //next(err);
                    }
//                  throw err;
                });
//                connectionProvider.connectionStringProvider.closeConnection(connection);
                //next(err);
                err.errPlace = "Query";
            }
            else {

              connection.commit( function(errComm) {
                if (errComm !== null) {
                  connection.rollback(function (errRoll) {
                    if (errRoll !== null) {
//                      connectionProvider.connectionStringProvider.closeConnection(connection);
                      //next(err);
                      err.errPlace = "Rollback";
                      err.errRoll = errRoll;
                    }
//                    throw err;
                  });
                }
              });

//                  console.log(row);
              OnSuccessCallback({ status : "Successful"});
          }  // else (err !== null)

          if (err !== null) {

            setTimeout( function() {
              err.errFunction = "createSensor (mysql)";
              err.sql = query.sql;
              var error = errorHdlr.errorHandler(err);

              OnErrorCallback(error);
            }, 50);

          }

          connectionProvider.connectionStringProvider.closeConnection(connection);

        });  // query
      });    // beginTransaction
    }        // connection
  },         // createSensor


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

      connection.beginTransaction(function(err) {
        connection.query(updateStatement,
                [sensorUpdate.number, sensorUpdate.typeId,
                 sensorUpdate.location, sensorUpdate.id], function(err, row) {

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
                    OnErrorCallback({ error : "Sensor update error !!!"});
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

      connection.beginTransaction(function(err) {
        connection.query(deleteStatement,
                [sensorDelete.id], function(err, row) {

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
                OnErrorCallback({ error : "Sensor delete error !!!"});
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

      connection.beginTransaction(function(err) {
        connection.query(deleteStatement,
                [sensorDelete.typeId], function(err, row) {

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
                OnErrorCallback({ error : "Sensor delete error !!!"});
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
  },      // deleteSensorByTypeId


  getAllSensor : function (OnSuccessCallback) {

//    console.log("Config: getAllSensor");

    var selectStatement = "SELECT s.*, t.model " +
                          "FROM tbl_sensor AS s, tbl_sensorType AS t " +
                          "WHERE s.type_id = t.id " +
                          "ORDER BY s.id ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [], function (err, rows, fields)  {

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

      connection.query(selectStatement, [sensorId], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }  // getSensorById

};


module.exports.sensorDao = sensorDao;
