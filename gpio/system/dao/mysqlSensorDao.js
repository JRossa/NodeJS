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
      });
    } // connection

  },


  createSensor : function (sensorData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_sensor VALUES(NULL, ?, ?, ?)";

    var sensorInsert = {

      number : sensorData.sensorNumber,
      typeId : sensorData.sensorTypeId,
      location : sensorData.sensorLocation
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(insertStatement,
                [sensorInsert.number, sensorInsert.typeId, sensorInsert.location], function(err, row) {

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
                OnErrorCallback({ error : "Sensor already exists !!!"});
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
                    OnErrorCallback({ error : "Sensor already exists !!!"});
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
                OnErrorCallback({ error : "Sensor already exists !!!"});
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
                OnErrorCallback({ error : "Sensor already exists !!!"});
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

    var insertStatement = "SELECT s.*, t.model " +
                          "FROM tbl_sensor AS s, tbl_sensorType AS t " +
                          "WHERE s.type_id = t.id " +
                          "ORDER BY s.id ";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(insertStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },

  getSensorById : function (sensorId, OnSuccessCallback) {

    var insertStatement = "SELECT * FROM tbl_sensor WHERE Id = ?";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(insertStatement, [sensorId], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }


}

module.exports.sensorDao = sensorDao;
