var connectionProvider = require('../db/sqliteConnectionStringProvider');

var eventDao = {


  createTable : function () {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');

    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_event'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_event" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[sensor_id] INTEGER NULL, ' +
                    '[act_time] DATETIME UNIQUE  NULL, ' +
                    'FOREIGN KEY(sensor_id) REFERENCES tbl_sensor(id))', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_event' initialized.");
                    }
                });
            } else {
                console.log("SQL Table 'tbl_event' already initialized.");
            }
        }
      }); // get
    });   // serialize
  },      // createTable


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
                    OnErrorCallback({ error : "Event already exists !!!"});
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
  },      // createEvent


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
    }     // connection
  },      // deleteEvent


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
      });  // serialize
    }      // connection
  },       // deleteAllEvent


  getAllEvent : function (OnSuccessCallback) {

    var selectStatement = "SELECT e.*, s.num AS sensor_num, " +
                                      "s.location AS sensor_location " +
                          "FROM tbl_event AS e, tbl_sensor AS s " +
                          "WHERE e.sensor_id = s.id " +
                          "ORDER BY e.id ";

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
  },  // getAllEvent


  checkEvent : function (sensorId, intervalTime, OnSuccessCallback) {

    var selectStatement = "SELECT COUNT(*) AS numEvents FROM tbl_event " +
                          "WHERE sensor_id = ? " +
                          "AND act_time > ? "
                          "ORDER BY id";

    console.log("ligação  " + sensorId);

    var currTime = new Date();
    var topTime = new Date(currTime - intervalTime).toJSON();

//    console.log(selectStatement);
//    console.log(currTime);
//    console.log(topTime);

    var eventCheck = {
      id : sensorId,
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
  }  // checkEvent

}


module.exports.eventDao = eventDao;
