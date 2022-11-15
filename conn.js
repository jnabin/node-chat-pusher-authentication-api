const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'chatapp',
    multipleStatements: true,
    charset : 'utf8mb4'
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

        create table if not exists messages(
            id int primary key auto_increment,
            session_id int null,
            group_chat_id int null,
            content text not null,
            from_user_id varchar(100) not null,
            message_type varchar(20) default 'direct',
            is_edited bit default 0,
            parent_message_id int null,
            file_url varchar(1000) null,
            timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

        create table if not exists chats(
            id int primary key auto_increment,
            session_id int not null,
            message_id int not null,
            user_id int not null,
            type int not null,
            timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

        create table if not exists sessions(
            id int primary key auto_increment,
            user1_id int not null,
            user2_id int not null,
            timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
        
            create table if not exists group_chats(
                id int primary key auto_increment,
                name varchar(255) not null,
                timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
        
            create table if not exists groups_users(
            id int primary key auto_increment,
            user_id int not null,
            group_id int not null,
            timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
    `;

    connection.query(createTables, (error, results, fields) => {
        if(error) console.log(error.message);
        else console.log('tables created');
    });
});

module.exports = connection;