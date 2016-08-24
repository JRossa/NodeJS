var connectionProvider = require('../db/mysqlConnectionStringProvider');

var sensorTypeDao = {


  createTable : function () {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_sensorType"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_sensorType' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_sensorType' +
                 '(id INTEGER NOT NULL AUTO_INCREMENT,' +
                 'model VARCHAR(30) UNIQUE NOT NULL,' +
                 'obs LONGTEXT NULL,' +
                 'PRIMARY KEY(id))', function (err) {
              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_sensorType' initialized.");
              }
            }); // Create Table
          }
        }

        connectionProvider.connectionStringProvider.closeConnection(connection);
      });  // query
    }      // connection
  },       // createTable


  createSensorType : function (sensorType, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_sensorType VALUES(NULL, ?, ?)";

    var sensorInsert = {

      model : sensorType.sensorModel,
      obs : sensorType.sensorObs
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {
        connection.beginTransaction(function(err) {
          connection.query(insertStatement,
                  [sensorInsert.model, sensorInsert.obs], function(err, row) {

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
                OnErrorCallback({ error : "Sensor Type already exists !!!"});
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
  },      // createSensorType


  updateSensorType : function (sensorType, OnSuccessCallback, OnErrorCallback) {

    var updateStatement = "UPDATE tbl_sensorType SET model = ?, obs = ? WHERE id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    var sensorUpdate = {
      id : sensorType.sensorId,
      model : sensorType.sensorModel,
      obs : sensorType.sensorObs
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(updateStatement,
                [sensorUpdate.model, sensorUpdate.obs, sensorUpdate.id], function(err, row) {

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
                    OnErrorCallback({ error : "Sensor Type update error !!!"});
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
  },      // updateSensorType


  deleteSensorType : function (sensorTypeId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_sensorType WHERE id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    console.log("ligação  " + sensorTypeId);

    var sensorDelete = {
      id : sensorTypeId
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
                OnErrorCallback({ error : "Sensor Type delete error !!!"});
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
  },      // deleteSensorType


  getAllSensorType : function (OnSuccessCallback) {

//    console.log("Config: getAllSensorType");

    var selectStatement = "SELECT * FROM tbl_sensorType ORDER BY id";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },  // getAllSensorType


  getSensorTypeById : function (sensorTypeId, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_sensorType WHERE id = ?";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [sensorTypeId], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }  // getSensorTypeById

}


module.exports.sensorTypeDao = sensorTypeDao;
