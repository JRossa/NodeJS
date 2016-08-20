
var connectionProvider = require('../db/sqliteConnectionStringProvider');

var actionTypeDao = {

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
    });   // serialize
  },      // actionTypeDao


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
    }     // connection
  }       // createActionType

}

module.exports.actionTypeDao = actionTypeDao;
