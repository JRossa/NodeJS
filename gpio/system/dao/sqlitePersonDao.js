/*jslint node: true */
/*jshint strict:false */
'use strict';

var connectionProvider = require('../db/sqliteConnectionStringProvider');

var personDao = {


  createTable : function (OnSuccessCallback) {

    var sqlite3 = require('sqlite3').verbose();
    var sqliteInit = require('../db/sqliteInit');
    var dbData = new sqlite3.Database(sqliteInit.dbName);

    // http://oz123.github.io/writings/2015-10-30-NOSQLite---SQLite-and-NoSQL/
    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_person'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_person" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[user_id] INTEGER NULL, ' +
                    '[name] VARCHAR(128) NULL, ' +
                    '[email] VARCHAR(128) NULL, ' +
                    'FOREIGN KEY(user_id) REFERENCES tbl_user(id))', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_person' initialized.");
                        OnSuccessCallback({ status : "Finished"});
                    }
                });
            } else {
                console.log("SQL Table 'tbl_person' already initialized.");
            }
        }
      }); // get
    });   // serialize
  },      // createTable


  createPerson : function (userData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_person VALUES(NULL, ?, ?, ?)";

    var userInsert = {
          user_id : userData.userId,
          name : userData.name,
          email : userData.email
        };

    console.log(userInsert);

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.serialize( function() {

        connection.run("BEGIN TRANSACTION");

        connection.run(insertStatement,
                [userInsert.user_id, userInsert.name,
                 userInsert.email], function(err, row) {

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


  deletePerson : function (userId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_person WHERE id = ? ";

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
  },      // deletePerson


  findOne : function (userData, OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_person WHERE email = ? ORDER BY id ";

    var userSelect = {
      email : userData.email,
    };

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [userSelect.email], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  }, // findOne


  getAllPerson : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_person ORDER BY id ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.all(selectStatement, [], function (err, rows, fields)  {

      if (err) { throw err;}

//        console.log(rows);
        OnSuccessCallback(rows);

      });

      connectionProvider.connectionStringProvider.closeConnection(connection);
    }
  } // getAllPerson


};


module.exports.personDao = personDao;
