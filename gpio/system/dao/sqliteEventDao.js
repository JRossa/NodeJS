var connectionProvider = require('../db/sqliteConnectionStringProvider');

var eventDao = {

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

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [eventInsert.sensorId, eventInsert.act_time], function(err, row) {

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
  }, // createEvent

  deleteEvent : function (eventId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_event WHERE id = ? ";

    console.log("ligação  " + eventId);

    var eventDelete = {
      id : eventId
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(deleteStatement,
                [eventDelete.id], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Event error !!!", srvErr : err});
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
  }, // deleteEvent

  deleteAllEvent : function (OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_event";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(deleteStatement,
                [], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Event error !!!", srvErr : err});
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
  }, // deleteAllEvent

  getAllEvent : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_event ORDER BY id ";

    console.log(selectStatement);

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

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
                          "ORDER BY id";

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

      connection.all(selectStatement, [eventCheck.id, eventCheck.fromDate], function (err, rows, fields)  {

      if (err) {
        console.log(err);
        throw err;
      }

//      console.log(rows);
      console.log(rows);
      OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }


}

module.exports.eventDao = eventDao;
