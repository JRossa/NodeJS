var connectionProvider = require('../db/mysqlConnectionStringProvider');

var eventDao = {

  createTable : function () {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_event"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_event' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_event' +
                '(id INTEGER NOT NULL AUTO_INCREMENT,' +
                'sensor_id INTEGER NOT NULL,' +
                'act_time TIMESTAMP UNIQUE NOT NULL,' +
                'PRIMARY KEY(id),' +
                'INDEX FK_tbl_event_tbl_sensor (sensor_id),' +
                'CONSTRAINT FK_tbl_event_tbl_sensor FOREIGN KEY (sensor_id) ' +
                'REFERENCES tbl_sensor (id) ON UPDATE NO ACTION ON DELETE NO ACTION)', function (err) {

              if (err !== null) {
                console.log(err);
                throw err;
              } else {
                console.log("SQL Table 'tbl_event' initialized.");
              }
            }); // Create Table
          }
        }
      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }  // connection

  },

  createEvent : function (eventData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_event VALUES(NULL, ?, ?)";

/*
    if (eventData.eventTime == "") {
      console.log("NULO");
      eventData.eventTime = new Date();
    }
*/
    console.log(eventData);

    var eventInsert = {

      sensorId : eventData.eventSensorId,
      act_time : eventData.eventTime
    };

    console.log(eventInsert);

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(insertStatement,
                [eventInsert.sensorId, eventInsert.act_time], function(err, row) {

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
      }); // serialize
    } // connection
  }, // createEvent

  deleteEvent : function (eventId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_event WHERE id = ? ";

    console.log("ligação  " + eventId);

    var eventDelete = {
      id : eventId
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(deleteStatement,
                [eventDelete.id], function(err, row) {

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
                    OnErrorCallback({ error : "Event error !!!", srvErr : err});
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
      }); // serialize
    } // connection
  }, // deleteEvent

  deleteAllEvent : function (OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_event ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(deleteStatement,
            [], function(err, row) {

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
                OnErrorCallback({ error : "Event error !!!", srvErr : err});
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
      }); // serialize
    } // connection
  }, // deleteAllEvent

  getAllEvent : function (OnSuccessCallback) {

//    var selectStatement = "SELECT * FROM tbl_event ORDER BY id ";
    var selectStatement = "SELECT e.*, s.num AS sensor_num " +
                          "FROM tbl_event AS e, tbl_sensor AS s " +
                          "WHERE e.sensor_id = s.id " +
                          "ORDER BY e.id ";

    console.log(selectStatement);

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [], function (err, rows, fields)  {

      if (err) {
        console.log(err);
        throw err;
      }

//      console.log(rows);
      OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },

  checkEvent : function (eventId, intervalTime, OnSuccessCallback) {

    var selectStatement = "SELECT COUNT(*) AS numEvents FROM tbl_event " +
                          "WHERE sensor_id = ? " +
                          "AND act_time > ? "
                          "ORDER BY id ";

    console.log("ligação  " + eventId);

    var currTime = new Date();
    var topTime = new Date(currTime - intervalTime).toJSON();

//    console.log(selectStatement);
//    console.log(currTime);
//    console.log(topTime);

    var eventCheck = {
      id : eventId,
      fromDate: topTime
    };


    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [eventCheck.id, eventCheck.fromDate], function (err, rows, fields)  {

      if (err) {
        console.log(err);
        throw err;
      }

//      console.log(rows);
      console.log(rows);
      OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    } // connection

  }
}

module.exports.eventDao = eventDao;
