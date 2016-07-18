var config = {
    db: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: '',
        port: 3306,
        //socket: '/var/run/mysqld/mysqld.sock', // For linux...
        //socket: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock', //For mac...
        debug: true
    },

    site: {
        url: 'http://localhost:3000',
        title: 'Pi 3',
        language: 'pt',
        database: 'mysql',
        os: 'windows',
        html: {
            engine: 'ejs',
            minify: true
        }
    },

    application: {
        langs: ['en', 'EN', 'pt', 'PT'],
        languages: 'en|pt'
    },
};

module.exports = config;
