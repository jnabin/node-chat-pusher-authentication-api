const connection = require('../../conn');
const pusher = require('../../config');

const groupMessages = (req, res) => {
    const groupId = req.body.groupId;
    connection.query(getMessageQuery(), [groupId], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        let messages = results;
        res.status(200).send({messages: messages});
    });
};

const groupMessagesWithChannel = async(req, res) => {
    const groupId = req.body.groupId;
    const userIds = req.body.userIds;
    const fromUserId = req.body.fromUserId;

    var channels = [];
    userIds.forEach(id => {
        channels.push(`private-notifications-${id}`);
    })

    let eventData = {
        'channel_name': `private-group-chat-${groupId}`,
        'initiated_by': fromUserId,
        'chat_with_ids'   : userIds,
        'groupId': groupId,
        'newGroup' : false
        };
    await pusher.trigger(channels, 'group-chat-request', eventData);

    connection.query(getMessageQuery(), [groupId], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        let messages = results;
        res.status(200).send({messages: messages});
    });
};

const groups = (req, res) => {
    let sql = `SELECT gc.id as groupId, gc.name as groupName, u.id as userId, u.name as userName
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    ORDER BY gc.name ASC`;

    connection.query(sql, (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
};

const getGroup = (req, res) => {
    let sql = `SELECT gc.id as groupId, gc.name as groupName, u.id as userId, u.name as userName
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    where gc.id = ?`;
    connection.query(sql, [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
};

const groupsByUser = (req, res) => {
    let sql = `SELECT gc.id as groupId, gc.name as groupName
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    where u.id = ?`;
    connection.query(sql, [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        console.log(results);
        res.status(200).send(results);
    });
};

const usersByGroup = (req, res) => {
    let sql = `SELECT u.id as userId, u.name as userName
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    where gc.id = ?`;
    connection.query(sql, [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
};

const deleteGroup = (req, res) => {
    connection.query('delete from group_chats where id = ?', [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(204).send('deleted');
    });
};

const createGroup = async(req, res) => {
    try {
        const userIds = req.body.userIds;
        const fromUserId = req.body.fromUserId;

        var channels = [];
        userIds.forEach(id => {
            channels.push(`private-notifications-${id}`);
        })

        connection.query(`insert into group_chats (name) values(?)`, [req.body.name], 
        async(error, results, fields) => {
            if(error) res.status(500).send('something went wrong');
            let groupId = results.insertId;
            let eventData = {
                'channel_name': `private-group-chat-${groupId}`,
                'initiated_by': fromUserId,
                'chat_with_ids'   : userIds,
                'groupId': groupId,
                'groupName': req.body.name,
                'newGroup' : true
                };
            await pusher.trigger(channels, 'group-chat-request', eventData);

            await Promise.all(
                userIds.map((_, i) => {
                    return queryPromise(
                        `insert into groups_users (user_id, group_id) values(?, ?)`, [userIds[i], groupId]
                    );
                })
            ).then(e => {
                res.status(200).send(groupId.toString());
            }).catch(err => {
                console.log(err);
                res.status(500).send('something went wrong');
            });
        });
    } catch(exc) {
        console.log(exc);
        res.status(500).send('something went wrong');
    }
};

const updateGroup = (req, res) => {
    try{
        const groupId = req.body.groupId;
        const userIds = req.body.userIds;
        const name = req.body.name;
        const isUpdateUsers = req.body.isUpdateUsers;

        connection.query('update group_chats set name = ? where id = ?', [name, groupId], async(error, results, fields) => {
            if(error) res.status(500).send('something went wrong');
            if(isUpdateUsers) {
                await Promise.all(queryPromise('delete from groups_users where group_id = ?', [groupId]))
                .catch(err => {
                    console.log(err);
                    res.status(500).send('something went wrong');
                });
                await Promise.all(
                    userIds.map((_, i) => {
                        return queryPromise(
                            `insert into groups_users (user_id, group_id) values(?, ?)`, [userIds[i], groupId]
                        );
                    })
                ).catch(err => {
                    console.log(err);
                    res.status(500).send('something went wrong');
                });

                res.status(200).send('updated');
            } else {
                res.status(200).send('updated');
            }
        });
    } catch(exc) {
        console.log(exc);
        res.status(500).send('something went wrong');
    }
};

function getMessageQuery(){
    return `select m.id as mid, m.file_url as fileUrl, m.message_type as messageType, bin(m.is_edited) as isEdited, m.parent_message_id as parentMessageId,
    m.content as message, m.timestamps as time, u.id as userId, u.name as uname, 
    g.id as groupId, g.name as groupName from group_chats g 
    inner join messages m on m.group_chat_id = g.id
    inner join users u on m.from_user_id = u.id
    where session_id is null and g.id = ?`;
 }

 function queryPromise(query, insertValues) {
    return new Promise((resolve, reject) => {
        connection.query(query, insertValues, (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }

            return resolve(result);
        });
    });
 }

 module.exports = {
    groupMessages,
    groupMessagesWithChannel,
    groups,
    usersByGroup,
    deleteGroup,
    createGroup,
    updateGroup,
    getGroup,
    groupsByUser
 }