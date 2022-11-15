const connection = require('../../conn');
const bcrypt = require('bcrypt');

const allUsers = (req, res) => {
    connection.query('select id, name from users', (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        //console.log(results);
        return res.status(200).send(results);
    });
};

const userWithLatestMessage = (req, res) => {
    let id = req.params.id;
    connection.query(getUsersWithLatestMessageQuery(), [id, id, id], (error, results, fields) => {
        if(error) {
            console.log(error);
            return res.status(500).send('something went wrong');
        } 
        //console.log(results);
        return res.status(200).send(results);
    });
};

const getUser = (req, res) => {
    connection.query('select id, name from users where id = ?', [req.params.id], (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(200).send(results);
    });
};

const deleteUser = (req, res) => {
    connection.query('delete from users where id = ?', [req.params.id], (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(204).send('deleted');
    });
};

const createUser = async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        connection.query(`insert into users (name, password) values(?, ?)`, [req.body.name, hashedPassword], 
        (error, results, fields) => {
            if(error) return res.status(500).send('something went wrong');
            let user = {id: results.insertId, name: req.body.name}
            return res.status(201).send(user);
        });
    } catch(exc) {
        console.log(exc);
        return res.status(500).send('something went wrong');
    }
}

function getUsersWithLatestMessageQuery() {
    return `select id, name, latestMessage.content, latestMessage.from_user_id as fromUserId, latestMessage.file_url as fileUrl,  latestMessage.timestamps as time from users u left join (
        select m.content, m.file_url, m.from_user_id, u.id as userId, m.timestamps from users u left join sessions s
        on u.id in (s.user1_id, s.user2_id) inner join (
        select m.id, m.content, m.file_url, m.from_user_id, m.session_id, m.timestamps from messages m left join messages b
        on m.session_id = b.session_id and m.id < b.id 
        where b.id is null 
        ) m
        on m.session_id = s.id 
        where u.id != ? and (s.user1_id = ? or s.user2_id = ?)
        ) latestMessage on u.id = latestMessage.userId`;
 }

 module.exports = {
    allUsers,
    userWithLatestMessage,
    getUser,
    deleteUser,
    createUser
 }