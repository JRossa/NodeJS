
var connectionString =  {

  connection :  {

      // Development
      dev : {

        dbName: './system/db/gpio.sqlite',

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

module.exports.connectionString = connectionString;
