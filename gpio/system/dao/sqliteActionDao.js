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
                    '[armed] BOOLEAN NULL, ' +
                    '[all_day] BOOLEAN NULL, ' +
                    '[period_id] INTEGER NULL, ' +
                    '[set_time] DATETIME UNIQUE NULL, ' +
                    '[user_id] INTEGER NULL, ' +
                    'FOREIGN KEY(type_id) REFERENCES tbl_actionType(id), ' +
                    'FOREIGN KEY(period_id) REFERENCES tbl_alarmPeriod(id))', function (err) {
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
    });   // serialize
  },      // createTableAction


  createAction : function (actionData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_action VALUES(NULL, ?, ?, ?, ?, ?, ?)";

    var d = new Date();
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

    var stamp = d.getFullYear() + "-" +
        ("0" + (d.getMonth()+1)).slice(-2) + "-" +
        ("0" +  d.getDate()).slice(-2) + " " +
        ("0" +  d.getHours()).slice(-2) + ":" +
        ("0" +  d.getMinutes()).slice(-2) + ":" +
        ("0" +  d.getSeconds()).slice(-2);

    var actionInsert = {
      type_id : actionData.typeId,
      armed : actionData.armed,
      all_day : actionData.allDay,
      period_id : actionData.periodId,
      set_time : stamp,
      user_id: '1'
    };

    console.log(actionInsert);

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [actionInsert.type_id, actionInsert.armed,
                 actionInsert.all_day, actionInsert.period_id,
                 actionInsert.set_time, actionInsert.user_id], function(err, row) {

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
    }     // connection
  },      // createAction


  deleteAction : function (actionId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_action WHERE id = ? ";

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
                    OnErrorCallback({ error : "Action delete error !!!"});
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
  },      // deleteAction


  getAllAction : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_action ORDER BY id ";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }, // getAllAction


  getLastAction : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_action ORDER BY id DESC LIMIT 1";

    connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

        if (err) {
          throw err;
        }

        // convert boolean 0 -> false & 1 -> true
        for (row in rows) {
          rows[row].all_day  = (rows[row].all_day == 0)? false: true;
          rows[row].armed  = (rows[row].armed == 0)? false: true;
        }

//        console.log(rows.length);
//        console.log(rows);
        OnSuccessCallback(rows);
      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }, // getLastAction


  /*
   ******************************************************************************
   * tbl_actionType
   ******************************************************************************
   */

  createTableActionType : function (OnSuccessCallback) {

    var actionTypeDao = require('./sqliteActionTypeDao');

    actionTypeDao.actionTypeDao.createTableActionType(OnSuccessCallback);

  }, // createTableActionType


  createActionType : function (actionTypeLst, OnSuccessCallback, OnErrorCallback) {

    var actionTypeDao = require('./sqliteActionTypeDao');

    actionTypeDao.actionTypeDao.createActionType(actionTypeLst, OnSuccessCallback, OnErrorCallback);

  }, // createActionType



  /*
   ******************************************************************************
   * tbl_alarmPeriod
   ******************************************************************************
   */

  createTableAlarmPeriod : function (OnSuccessCallback) {

    var alarmPeriodDao = require('./sqliteAlarmPeriodDao');

    alarmPeriodDao.alarmPeriodDao.createTableAlarmPeriod(OnSuccessCallback);

  }, // createTableAlarmPeriod


  createAlarmPeriod : function (alarmPeriod, OnSuccessCallback, OnErrorCallback) {


    var alarmPeriodDao = require('./sqliteAlarmPeriodDao');

    alarmPeriodDao.alarmPeriodDao.createAlarmPeriod(alarmPeriod, OnSuccessCallback, OnErrorCallback);

  }, // createAlarmPeriod


  getAlarmPeriod : function (periodId, OnSuccessCallback) {

    var alarmPeriodDao = require('./sqliteAlarmPeriodDao');

    alarmPeriodDao.alarmPeriodDao.getAlarmPeriod(periodId, OnSuccessCallback);

  } // getAlarmPeriod

}

module.exports.actionDao = actionDao;
