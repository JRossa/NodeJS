var connectionProvider = require('../db/sqliteConnectionStringProvider');

var sensorDao = {

  createSensor : function (sensorData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_sensor VALUES(NULL, ?, ?, ?)";

    var sensorInsert = {

      number : sensorData.sensorNumber,
      typeId : sensorData.sensorTypeId,
      location : sensorData.sensorLocation
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [sensorInsert.number, sensorInsert.typeId, sensorInsert.location], function(err, row) {

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
  }, // createSensor

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
  }, // updateSensor

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
  }, // deleteSensor

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
  }, // deleteSensorByTypeId

  getAllSensor : function (OnSuccessCallback) {

//    console.log("Config: getAllSensor");

    var insertStatement = "SELECT a.id, a.num, a.type_id, a.location, b.model " +
                          "FROM tbl_sensor AS a, tbl_sensorType AS b " +
                          "WHERE a.type_id = b.id ORDER BY a.id";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(insertStatement, [], function (err, rows, fields)  {

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

      connection.all(insertStatement, [sensorId], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }


}

module.exports.sensorDao = sensorDao;
