var ConnectionProvider = require('../db/mysqlConnectionStringProvider');

var sensorDao = {

  createSensorType : function (sensorTypeData, OnSuccessCallback) {

    console.log("Config: createSensorType");

    var insertStatement = "INSERT INTO tbl_sensorType SET ?";

    var sensorType = {

      model : sensorTypeData.sensorModel,
      obs : sensorTypeData.sensorObs
    }

    console.log(sensorTypeData);

    var connection = ConnectionProvider.ConnectionStringProvider.getConnection();

    console.log(connection);

    if (connection) {

      connection.query(insertStatement, sensorType, fumction (err, result) {

        if (err) { throw "Query error"}

        console.log(result);
        
        OnSuccessCallback({ status : "Successful"});
      });
    }     // connection
  },      // createSensorType


  getAllSensorType : function (OnSuccessCallback) {
/*    var insertStatement = "SELECT * FROM tbl_sensorType ORDER BY Id";

    connection = ConnectionProvider.ConnectionStringProvider.getConnection();


    if (connection) {

      connection.query(insertStatement, sensorType, function (err, rows, fields)  {

        if (err) { throw err;}

        console.log(rows);
        OnSuccessCallback(rows);

      });

      ConnectionProvider.ConnectionStringProvider.closeConnection(connection);
    }
*/

  }
}

module.exports.sensorDao = sensorDao;
