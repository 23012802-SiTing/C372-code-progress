const mysql = require('mysql2');

//Database connection details
const db = mysql.createConnection({
    //host: 'localhost',
    //user: 'root',
    //password: 'Republic_C207',
    //database:'c372_ga'

    host:'mysql-siting.alwaysdata.net',
    user: 'siting',
    password:'MT>dreams2651',
    database: 'siting_c372'
  });

//Connecting to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;