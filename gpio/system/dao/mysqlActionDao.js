/*jslint node: true */
/*jshint strict:false */
'use strict';

var connectionProvider = require('../db/mysqlConnectionStringProvider');

var actionDao = {

  createTableAction : function () {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_action"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_action' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_action ' +
                '(id INTEGER NOT NULL AUTO_INCREMENT, ' +
                'type_id INTEGER NULL, ' +
                'armed BOOLEAN NULL, ' +
                'all_day BOOLEAN NULL, ' +
                'period_id INTEGER NULL, ' +
                'set_time DATETIME NULL, ' +
                'user_id INTEGER NULL, ' +
                'PRIMARY KEY (id), ' +
              	'INDEX FK_tbl_action_tbl_actionType (type_id), ' +
              	'INDEX FK_tbl_action_tbl_alarmPeriod (period_id), ' +
              	'INDEX FK_tbl_action_tbl_user (user_id), ' +
                'CONSTRAINT FK_tbl_action_tbl_user FOREIGN KEY (user_id) ' +
                'REFERENCES tbl_user (id) ON UPDATE NO ACTION ON DELETE NO ACTION, ' +
                'CONSTRAINT FK_tbl_action_tbl_actionType FOREIGN KEY (type_id) ' +
                'REFERENCES tbl_actionType (id) ON UPDATE NO ACTION ON DELETE NO ACTION, ' +
                'CONSTRAINT FK_tbl_action_tbl_alarmPeriod FOREIGN KEY (period_id) ' +
                'REFERENCES tbl_alarmPeriod (id) ON UPDATE NO ACTION ON DELETE NO ACTION)', function (err) {

              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_action' initialized.");
              }
            }); // Create Table
          }
        }

        connectionProvider.connectionStringProvider.closeConnection(connection);

      }); // query
    }     // connection
  },      // createTableAction


  createAction : function (actionData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_action VALUES(NULL, ?, ?, ?, ?, ?, ?)";

    var utilTime = require('../utils/utilTime');
    var d = new Date();
    var stamp = utilTime.convertTime(d, false);

    var actionInsert = {
      type_id : actionData.typeId,
      armed : actionData.armed,
      all_day : actionData.allDay,
      period_id : actionData.periodId,
      set_time : stamp,
      user_id: '1'
    };


    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(insertStatement,
                [actionInsert.type_id, actionInsert.armed,
                 actionInsert.all_day, actionInsert.period_id,
                 actionInsert.set_time, actionInsert.user_id], function(err, row) {

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
                    OnErrorCallback({ error : "Action already exists !!!"});
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
  },      // createAction


  deleteAction : function (actionId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_action WHERE id = ? ";

    console.log("ligação  " + actionId);

    var actionDelete = {
      id : actionId
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(deleteStatement,
                [actionDelete.id], function(err, row) {

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
                    OnErrorCallback({ error : "Action delete error !!!"});
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
  },      // deleteAction


  getAllAction : function (OnSuccessCallback) {
/*
    var selectStatement = "SELECT a.*, t.type AS type_name, " +
                                      "p.start AS startPeriod, " +
                                      "p.end AS endPeriod " +
                          "FROM tbl_action AS a, " +
                               "tbl_actionType AS t, " +
                               "tbl_alarmPeriod AS p " +
                          "WHERE a.type_id = t.id AND " +
                                "a.period_id = p.id " +
                          "ORDER BY a.id";
*/
    var selectStatement = "SELECT a.*, t.type AS type_name " +
                          "FROM tbl_action AS a, tbl_actionType AS t " +
                          "WHERE a.type_id = t.id ORDER BY a.id";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [], function (err, rows, fields)  {

      if (err) {
        console.log(err);
        throw err;
      }

      // convert boolean 0 -> false & 1 -> true
      for (var row in rows) {
        rows[row].all_day  = (rows[row].all_day === 0)? false: true;
        rows[row].armed  = (rows[row].armed === 0)? false: true;
      }

      console.log(rows);
      OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }, // getAllAction


  getLastAction : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_action ORDER BY id DESC LIMIT 1";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [], function (err, rows, fields)  {

      if (err) {
        console.log(err);
        throw err;
      }

      // convert boolean 0 -> false & 1 -> true
      for (var row in rows) {
        rows[row].all_day  = (rows[row].all_day === 0)? false: true;
        rows[row].armed  = (rows[row].armed === 0)? false: true;
      }

//      console.log(rows);
      OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  },


  /*
   ******************************************************************************
   * tbl_actionType
   ******************************************************************************
   */

  createTableActionType : function (OnSuccessCallback) {

    var actionTypeDao = require('./mysqlActionTypeDao');

    actionTypeDao.actionTypeDao.createTableActionType(OnSuccessCallback);

  }, // createTableActionType


  createActionType : function (actionTypeLst, OnSuccessCallback, OnErrorCallback) {

    var actionTypeDao = require('./mysqlActionTypeDao');

    actionTypeDao.actionTypeDao.createActionType(actionTypeLst, OnSuccessCallback, OnErrorCallback);

  }, // createActionType



  /*
   ******************************************************************************
   * tbl_alarmPeriod
   ******************************************************************************
   */

  createTableAlarmPeriod : function (OnSuccessCallback) {

    var alarmPeriodDao = require('./mysqlAlarmPeriodDao');

    alarmPeriodDao.alarmPeriodDao.createTableAlarmPeriod(OnSuccessCallback);

  }, // createTableAlarmPeriod


  createAlarmPeriod : function (alarmPeriod, OnSuccessCallback, OnErrorCallback) {


    var alarmPeriodDao = require('./mysqlAlarmPeriodDao');

    alarmPeriodDao.alarmPeriodDao.createAlarmPeriod(alarmPeriod, OnSuccessCallback, OnErrorCallback);

  }, // createAlarmPeriod


  getAlarmPeriod : function (periodId, OnSuccessCallback) {

    var alarmPeriodDao = require('./mysqlAlarmPeriodDao');

    alarmPeriodDao.alarmPeriodDao.getAlarmPeriod(periodId, OnSuccessCallback);

  } // getAlarmPeriod

};


module.exports.actionDao = actionDao;
