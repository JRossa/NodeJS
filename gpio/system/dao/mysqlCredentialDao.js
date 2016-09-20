/*jslint node: true */
/*jshint strict:false */
'use strict';

var connectionProvider = require('../db/mysqlConnectionStringProvider');

var credentialDao = {


  createTable : function (OnSuccessCallback) {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_credential"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_credential' already initialized.");
            'CONSTRAINT FK_tbl_action_tbl_user FOREIGN KEY (user_id) ' +
            'REFERENCES tbl_user (id) ON UPDATE NO ACTION ON DELETE NO ACTION, ' +
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_credential ' +
                '(id INTEGER NOT NULL AUTO_INCREMENT, ' +
                'user_id INTEGER NULLL, ' +
                'type VARCHAR(20) NULL, ' +
                'credential VARCHAR(512) NULL, ' +
                'PRIMARY KEY (id), ' +
                'INDEX FK_tbl_credential_tbl_user (user_id), ' +
                'CONSTRAINT FK_tbl_credential_tbl_user FOREIGN KEY (user_id) ' +
                'REFERENCES tbl_user (id) ON UPDATE NO ACTION ON DELETE NO ACTION)', function (err) {

              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_credential' initialized.");
                OnSuccessCallback({ status : "Finished"});              }
            }); // Create Table
          }
        }

        connectionProvider.connectionStringProvider.closeConnection(connection);

      }); // query
    }     // connection
  },      // createTable


  createCredential : function (userData, OnSuccessCallback, OnErrorCallback) {

    var insertStatement = "INSERT INTO tbl_credential VALUES(NULL, ?, ?, ?)";

    var userInsert = {
      user_id : userData.userId,
      credentialType : userData.credentialType,
      credential : userData.credential
    };


    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(insertStatement,
                [userInsert.user_id, userInsert.credentialType,
                 userInsert.credential], function(err, row) {

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
                    OnErrorCallback({ error : "User already exists !!!"});
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
  },      // createCredential


  deleteCredential : function (userId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_credential WHERE id = ? ";

    var actionDelete = {
      id : userId
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
                    OnErrorCallback({ error : "User delete error !!!"});
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
  },      // deleteCredential


  getAllCredential : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_credential ORDER BY id ";

    var connection = connectionProvider.connectionStringProvider.getConnection();

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
  } // getAllCredential

};


module.exports.credentialDao = credentialDao;
