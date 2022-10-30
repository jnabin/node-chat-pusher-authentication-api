const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'chatapp',
    multipleStatements: true
});

connection.connect(err => {
    if(err) console.log(`error: ${err.message}`);
    else console.log("db created");

    let createTables = `
        create table if not exists users(
        id int primary key auto_increment,
        name varchar(255) not null,
        password varchar(2000) not null,
        timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

        create table if not exists chat_rooms(
        id int primary key auto_increment,
        name varchar(255) not null,
        timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

        create table if not exists chat_messages(
        id int primary key auto_increment,
        chat_room_id int not null,
        user_id int not null,
        message varchar(8000) not null,
        timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
    `;

    connection.query(createTables, (error, results, fields) => {
        if(error) console.log(error.message);
        else console.log('tables created');
    });
});

module.exports = connection;