/*jslint node: true */
/*jshint strict:false */
'use strict';

var connectionProvider = require('../db/sqliteConnectionStringProvider');

var credentialDao = {


  createTable : function (OnSuccessCallback) {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    // http://oz123.github.io/writings/2015-10-30-NOSQLite---SQLite-and-NoSQL/
    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_credential'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_credential" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[user_id] INTEGER NULL, ' +
                    '[type] VARCHAR(20) NULL, ' +
                    '[credential] JSON NULL, ' +
                    'FOREIGN KEY(user_id) REFERENCES tbl_user(id))', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_credential' initialized.");
                        OnSuccessCallback({ status : "Finished"});
                    }
                });
            } else {
                console.log("SQL Table 'tbl_credential' already initialized.");
            }
        }
      }); // get
    });   // serialize
  },      // createTable


  createCredential : function (userData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_credential VALUES(NULL, ?, ?, json(?))";

    var userInsert = {
          user_id : userData.userId,
          credentialType : userData.credentialType,
          credential : userData.credential
        };

    console.log(userInsert);

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [userInsert.user_id, userInsert.credentialType,
                 userInsert.credential], function(err, row) {

                if (err !== null) {
                    // Express handles errors via its next function.
                    // It will call the next operation layer (middleware),
                    // which is by default one that handles errors.
                    console.log(connection.run);
                    console.log(err);
                    connection.run("ROLLBACK");
                    connectionProvider.connectionStringProvider.closeConnection(connection);
                    //next(err);
                    OnErrorCallback({ error : "User already exists !!!"});
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
  },      // createCredential


  deleteCredential : function (userId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_credential WHERE id = ? ";

    console.log("ligação  " + userId);

    var actionDelete = {
      id : userId
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
                    OnErrorCallback({ error : "User delete error !!!"});
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
  },      // deleteCredential


  getAllCredential : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_credential ORDER BY id ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  } // getAllCredential


};


module.exports.credentialDao = credentialDao;
