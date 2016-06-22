var connectionProvider = require('../db/sqliteConnectionStringProvider');

var pinDao = {

  createPin : function (pinData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_pin VALUES(NULL, ?, ?, ?, ?, ?)";

    var pinInsert = {

      bcm : pinData.gpioBCM,
      board : pinData.gpioBOARD,
      sensorId : pinData.gpioSensorId,
      input : pinData.gpioInput,
      used : pinData.gpioUsed
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [pinInsert.bcm, pinInsert.board, pinInsert.sensorId,
                  pinInsert.input, pinInsert.used], function(err, row) {

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
  }, // createPin

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
  }, // deletePin

  getAllPin : function (OnSuccessCallback) {

    var insertStatement = "SELECT * FROM tbl_pin ORDER BY id ";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(insertStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }

}

module.exports.pinDao = pinDao;
