
var mysqlConnectionString = {

  connection :  {

      // Development
      dev : {

        host: '192.168.1.61',
        user: 'root',
        password : 'root',
        database : 'gpio'

      },

      // Quality Analisys
      qa : {

        host: 'localhost',
        user: 'root',
        password : 'root',
        database : 'gpio'

      },

      // Prodution
      prod : {

        host: 'localhost',
        user: 'root',
        password : 'root',
        database : 'gpio'

      },

  }


}

module.exports.mysqlConnectionString = mysqlConnectionString;


module.exports.mysqlConnectionString = mysqlConnectionString;
