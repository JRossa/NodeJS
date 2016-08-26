var connectionProvider = require('../db/mysqlConnectionStringProvider');

var userDao = {


  createTable : function () {

    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.query('SHOW TABLES LIKE "tbl_user"', function (err, row, fields) {

        if (err !== null) {
            console.log(err);
            connectionProvider.connectionStringProvider.closeConnection(connection);
            throw err;
        } else {
          if (row.length > 0) {
            console.log("SQL Table 'tbl_user' already initialized.");
          } else {
            connection.query('CREATE TABLE IF NOT EXISTS tbl_user ' +
                '(id INTEGER NOT NULL AUTO_INCREMENT, ' +
                'login VARCHAR(100) UNIQUE NOT NULL, ' +
                'password VARCHAR(150) NULL, ' +
                'person_id INTEGER NULL, ' +
                'group_id INTEGER NULL, ' +
                'lastlogin_date DATETIME NULL, ' +
                'created_date DATETIME NULL, ' +
                'modified_date DATETIME NULL, ' +
                'PRIMARY KEY (id))', function (err) {

              if (err !== null) {
                console.log(err);
                connectionProvider.connectionStringProvider.closeConnection(connection);
                throw err;
              } else {
                console.log("SQL Table 'tbl_user' initialized.");
              }
            }); // Create Table
          }
        }

        connectionProvider.connectionStringProvider.closeConnection(connection);

      }); // query
    }     // connection
  },      // createTable


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


    var connection = connectionProvider.connectionStringProvider.getConnection();

    if (connection) {

      connection.beginTransaction(function(err) {
        connection.query(insertStatement,
                [userInsert.login, userInsert.password,
                 userInsert.person_id, userInsert.role_id,
                 userInsert.lastlogin_date, userInsert.created_date,
                 userInsert.modified_date], function(err, row) {

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
  },      // createUser


  deleteUser : function (userId, OnSuccessCallback, OnErrorCallback) {

    var deleteStatement = "DELETE FROM tbl_user WHERE id = ? ";

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
  },      // deleteUser


  getAllUser : function (OnSuccessCallback) {

    var selectStatement = "SELECT * FROM tbl_user ORDER BY id ";

    connection = connectionProvider.connectionStringProvider.getConnection();

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
  } // getAllUsers



}


module.exports.userDao = userDao;
