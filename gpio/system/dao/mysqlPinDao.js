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
                'sensor_id INTEGER UNIQUE NOT NULL,' +
                'input BOOLEAN NULL,' +
                'used BOOLEAN NULL,' +
                'alarm_duration INTEGER NULL,' +
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
      });
    }  // connection

  },

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

      connection.beginTransaction(function(err) {
        connection.query(insertStatement,
                [pinInsert.bcm, pinInsert.board, pinInsert.sensorId,
                  pinInsert.input, pinInsert.used], function(err, row) {

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
      }); // beginTransaction
    }     // connection
  },      // deletePin

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
