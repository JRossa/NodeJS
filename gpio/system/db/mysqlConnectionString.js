
var connectionString = {

  connection :  {

      // Development
      dev : {

        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME

      },

      // Quality Analisys
      qa : {

      },

      // Prodution
      prod : {

      },

  }


}

module.exports.connectionString = connectionString;
