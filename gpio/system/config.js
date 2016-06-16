var config = {
    db: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: '',
        port: 3306,
        debug: true,
        //socket: '/var/run/mysqld/mysqld.sock', // For linux...
        socket: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock' //For mac...
    },

    site: {
        url: 'http://localhost:3000',
        title: 'GPIO App',
        language: 'en',
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