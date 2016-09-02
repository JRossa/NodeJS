/*jslint node: true */
/*jshint strict:false */
'use strict';

var connectionProvider = require('../db/mysqlConnectionStringProvider');

var actionTypeDao = {


  createTableActionType : function (OnSuccessCallback) {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_actionType"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_actionType' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_actionType ' +
                '(id INTEGER NOT NULL AUTO_INCREMENT, ' +
                'type VARCHAR(20) NULL DEFAULT NULL, ' +
                'description VARCHAR(50) NULL DEFAULT NULL, ' +
                'PRIMARY KEY (id), ' +
                'UNIQUE INDEX type (type))', function (err) {

              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_actionType' initialized.");
                OnSuccessCallback({ status : "Finished"});
              }
            }); // Create Table
          }
        }

        connectionProvider.connectionStringProvider.closeConnection(connection);

      }); // query
    }     // connection
  },      // createTableActionType


  createActionType : function (actionTypeLst, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_actionType VALUES(NULL, ?, ?)";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {

        actionTypeLst.forEach( function (actionType) {

          var actionTypeInsert = {
            type : actionType.type,
            description : actionType.description
          };

          console.log(actionTypeInsert);

          connection.query(insertStatement,
                  [actionTypeInsert.type, actionTypeInsert.description], function(err, row) {

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
                      OnErrorCallback({ error : "Action Type Error !!!"});
                      return;
                  }
/*
                  else {
                    connection.commit(function(err) {
                      if (err) {
                        connection.rollback(function() {
                          throw err;
                        });
                      }
                    });

  //                  console.log(row);
  //                  OnSuccessCallback({ status : "Successful"});
                }
                */
            });
          }); // forEach

        connection.commit( function(err) {
          if (err) {
            return connection.rollback(function() {
              throw err;
            });
          }
        });
        connectionProvider.connectionStringProvider.closeConnection(connection);

        OnSuccessCallback({ status : "Successful"});
      });     // beginTransation
    }         // connection
  },          // createActionType


  getActionTypeByTag : function (actionTypeTag, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_actionType WHERE type = ?";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query(selectStatement, [actionTypeTag], function (err, rows, fields)  {

      if (err) {
        console.log(err);
        throw err;
      }

//      console.log(rows);
      OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }    // getActionTypeByTag

};


module.exports.actionTypeDao = actionTypeDao;
