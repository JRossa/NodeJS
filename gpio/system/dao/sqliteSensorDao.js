var connectionProvider = require('../db/sqliteConnectionStringProvider');

var sensorDao = {

  createSensorType : function (sensorTypeData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_sensorType VALUES(NULL,?,?)";

    var sensorType = {

      model : sensorTypeData.sensorModel,
      obs : sensorTypeData.sensorObs
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [sensorType.model, sensorType.obs], function(err, row) {

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
    }     // connection
  },      // createSensorType


  getAllSensorType : function (OnSuccessCallback) {

//    console.log("Config: getAllSensorType");

    var insertStatement = "SELECT * FROM tbl_sensorType ORDER BY Id";

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

    var insertStatement = "SELECT * FROM tbl_sensorType WHERE Id = ?";

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

module.exports.sensorDao = sensorDao;
