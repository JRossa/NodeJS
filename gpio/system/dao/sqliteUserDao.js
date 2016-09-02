/*jslint node: true */
/*jshint strict:false */
'use strict';

var connectionProvider = require('../db/sqliteConnectionStringProvider');

var userDao = {


  createTable : function () {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_user'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_user" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[login] VARCHAR(100) UNIQUE NOT NULL, ' +
                    '[password] VARCHAR(150) NULL, ' +
                    '[person_id] INTEGER NULL, ' +
                    '[group_id] INTEGER NULL, ' +
                    '[lastlogin_date] DATETIME NULL, ' +
                    '[created_date] DATETIME NULL, ' +
                    '[modified_date] DATETIME NULL)', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_user' initialized.");
                    }
                });
            } else {
                console.log("SQL Table 'tbl_user' already initialized.");
            }
        }
      }); // get
    });   // serialize
  },      // createTableAction


  createUser : function (userData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_user VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)";

    var d = new Date();
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

    var stamp = d.getFullYear() + "-" +
        ("0" + (d.getMonth()+1)).slice(-2) + "-" +
        ("0" +  d.getDate()).slice(-2) + " " +
        ("0" +  d.getHours()).slice(-2) + ":" +
        ("0" +  d.getMinutes()).slice(-2) + ":" +
        ("0" +  d.getSeconds()).slice(-2);

        var userInsert = {
          login : userData.login,
          password : userData.password,
          person_id : null,
          group_id : null,
          lastlogin_date : null,
          created_date : stamp,
          modified_date: null
        };

    console.log(userInsert);

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [userInsert.login, userInsert.password,
                 userInsert.person_id, userInsert.role_id,
                 userInsert.lastlogin_date, userInsert.created_date,
                 userInsert.modified_date], function(err, row) {

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
  },      // createUser


  deleteUser : function (userId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_user WHERE id = ? ";

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
  },      // deleteUser


  getAllUser : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_user ORDER BY id ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  } // getAllUsers


};


module.exports.userDao = userDao;
