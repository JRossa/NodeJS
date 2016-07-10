var connectionProvider = require('../db/sqliteConnectionStringProvider');

var sensorTypeDao = {

  createTable : function () {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');

    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_sensorType'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
              if (rows === undefined) {
                  dbData.run('CREATE TABLE "tbl_sensorType" ' +
                      '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                      '[model] VARCHAR(20)  UNIQUE NULL, ' +
                      '[obs] VARCHAR(100)  NULL)', function (err) {
                      if (err !== null) {
                          console.log(err);
                      } else {
                          console.log("SQL Table 'tbl_sensorType' initialized.");
                      }
                  });
              } else {
                  console.log("SQL Table 'tbl_sensorType' already initialized.");
              }
          }
      }); //get

    }); // serialize

  },

  createSensorType : function (sensorType, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_sensorType VALUES(NULL, ?, ?)";

    var sensorInsert = {

      model : sensorType.sensorModel,
      obs : sensorType.sensorObs
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [sensorInsert.model, sensorInsert.obs], function(err, row) {

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
  }, // createSensorType

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

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(updateStatement,
                [sensorUpdate.model, sensorUpdate.obs, sensorUpdate.id], function(err, row) {

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
  }, // updateSensorType

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
  }, // deleteSensorType

  getAllSensorType : function (OnSuccessCallback) {

//    console.log("Config: getAllSensorType");

    var insertStatement = "SELECT * FROM tbl_sensorType ORDER BY id";

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

  getSensorTypeById : function (sensorTypeId, OnSuccessCallback) {

    var insertStatement = "SELECT * FROM tbl_sensorType WHERE id = ?";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(insertStatement, [sensorTypeId], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }


}

module.exports.sensorTypeDao = sensorTypeDao;
