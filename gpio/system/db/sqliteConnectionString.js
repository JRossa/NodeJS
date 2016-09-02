
var connectionString =  {

  connection :  {

      // Development
      dev : {

        dbName: './system/db/' + process.env.DB_NAME + '.sqlite',

      },

      // Quality Analisys
      qa : {

      },

      // Prodution
      prod : {

      },

  }

};


module.exports.connectionString = connectionString;
