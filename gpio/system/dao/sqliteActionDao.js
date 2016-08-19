var connectionProvider = require('../db/sqliteConnectionStringProvider');

var actionDao = {


  createTableAction : function () {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_action'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_action" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[type_id] INTEGER NULL, ' +
                    '[switch] BOOLEAN NULL, ' +
                    '[period] BOOLEAN NULL, ' +
                    '[set_time] DATETIME UNIQUE  NULL, ' +
                    '[user_id] INTEGER NULL, ' +
                    'FOREIGN KEY(type_id) REFERENCES tbl_actionType(id))', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_action' initialized.");
                    }
                });
            } else {
                console.log("SQL Table 'tbl_action' already initialized.");
            }
        }
      }); // get

    }); // serialize

  },


  createAction : function (actionData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_action VALUES(NULL, ?, ?)";

    var actionInsert = {
      type : actionType.type,
      description : actionType.description
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [actionInsert.bcm, actionInsert.board], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Action already exists !!!"});
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


  createTableActionType : function (OnSuccessCallback) {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_actionType'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_actionType" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[type] VARCHAR(20) UNIQUE NULL, ' +
                    '[description] VARCHAR(50)  NULL)', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_actionType' initialized.");
                        OnSuccessCallback({ status : "Finished"});
                    }
                });
            } else {
                console.log("SQL Table 'tbl_actionType' already initialized.");
            }
        }
      }); // get

    }); // serialize

  },


  createActionType : function (actionTypeLst, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_actionType VALUES(NULL, ?, ?)";


    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {


      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        actionTypeLst.forEach( function (actionType) {

          var actionTypeInsert = {
            type : actionType.type,
            description : actionType.description
          };

          console.log(actionTypeInsert);

          connection.run(insertStatement,
                  [actionTypeInsert.type, actionTypeInsert.description], function(err, row) {

                  if (err !== null) {
                      // Express handles errors via its next function.
                      // It will call the next operation layer (middleware),
                      // which is by default one that handles errors.
                      console.log(connection.run);
                      console.log(err);
                      connection.run("ROLLBACK");
                      connectionProvider.connectionStringProvider.closeConnection(connection);
                      //next(err);
                      OnErrorCallback({ error : "Action Type already exists !!!"});
                  }
                  else {

  //                  console.log(row);
  //                  OnSuccessCallback({ status : "Successful"});
                }
              });

        });

        connection.run("COMMIT");
        connectionProvider.connectionStringProvider.closeConnection(connection);

        OnSuccessCallback({ status : "Successful"});

      }); // serialize
    } // connection

  }, // createActionType


  createTableAlarmPeriod : function (OnSuccessCallback) {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_alarmPeriod'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_alarmPeriod" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[start] VARCHAR(20) UNIQUE NULL, ' +
                    '[end] VARCHAR(50)  NULL)', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_alarmPeriod' initialized.");
                        OnSuccessCallback({ status : "Finished"});
                    }
                });
            } else {
                console.log("SQL Table 'tbl_alarmPeriod' already initialized.");
            }
        }
      }); // get

    }); // serialize

  },


  deleteAction : function (actionId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_action WHERE id = ? ";

//    console.log("ligação  " + sensorType.sensorId);
//    console.log("ligação  " + sensorType.sensorModel);
//    console.log("ligação  " + sensorType.sensorObs);

    console.log("ligação  " + pinId);

    var actionDelete = {
      id : actionId
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(deleteStatement,
                [actionDelete.id], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "Pin already exists !!!"});
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

  getAllAction : function (OnSuccessCallback) {

    var insertStatement = "SELECT * FROM tbl_action ORDER BY id ";

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

module.exports.actionDao = actionDao;
