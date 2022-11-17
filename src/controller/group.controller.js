const connection = require('../../conn');
const pusher = require('../../config');

const groupMessages = (req, res) => {
    const groupId = req.body.groupId;
    fetchMessageWithReacts(groupId).then(messages => {
        return res.status(200).send({messages: messages});
    }).catch(err => {
        return res.status(500).send('something went wrong');
    });
};

const groupMessagesWithChannel = async(req, res) => {
    const groupId = req.body.groupId;
    const userIds = req.body.userIds;
    const fromUserId = req.body.fromUserId;

    var channels = [];
    console.log(userIds);
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

    fetchMessageWithReacts(groupId).then(messages => {
        return res.status(200).send({messages: messages});
    }).catch(err => {
        return res.status(500).send('something went wrong');
    });
};

const groups = (req, res) => {
    let sql = `SELECT gc.id as groupId, gc.name as groupName, u.id as userId, u.name as userName
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    ORDER BY gc.name ASC`;

    connection.query(sql, (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(200).send(results);
    });
};

const getGroup = (req, res) => {
    let sql = `SELECT gc.id as groupId, gc.name as groupName, u.id as userId, u.name as userName
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    where gc.id = ?`;
    connection.query(sql, [req.params.id], (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(200).send(results);
    });
};

const groupsByUser = (req, res) => {
    connection.query(getGroupsWithLatestMessageQuery(), [req.params.id], (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        let uniqueGroupIds = [...new Set( results.map(x => x.groupId))];
        let groupUsersSql = `SELECT u.id as id, u.name as name, gc.id AS groupId
                            FROM users AS u
                            INNER JOIN groups_users AS gu ON u.id = gu.user_id
                            INNER JOIN group_chats AS gc ON gu.group_id = gc.id
                            where gc.id in (${uniqueGroupIds});`;
        connection.query(groupUsersSql, (error, userResults, fields) => {
            if(error) return res.status(500).send('something went wrong');
            results.forEach(g => {
                g.users = userResults.filter(x => x.groupId == g.groupId);
            });
            return res.status(200).send(results);
        });
    });
};

const usersByGroup = (req, res) => {
    let sql = `SELECT u.id as id, u.name as name
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    where gc.id = ?`;
    connection.query(sql, [req.params.id], (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(200).send(results);
    });
};

const deleteGroup = (req, res) => {
    connection.query('delete from group_chats where id = ?', [req.params.id], (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(204).send('deleted');
    });
};

const createGroup = async(req, res) => {
    try {
        const userIds = req.body.userIds;
        const fromUserId = req.body.fromUserId;

        let channels = [];
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
                return res.status(200).send(groupId.toString());
            }).catch(err => {
                console.log(err);
                return res.status(500).send('something went wrong');
            });
        });
    } catch(exc) {
        console.log(exc);
        return res.status(500).send('something went wrong');
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
                connection.query(`SELECT user_id as id FROM groups_users where group_id = ?`, [groupId], (error, results, fields) => {
                   let previusIds = results.map(x => x.id);
                   let newIds = [];
                   let deletedIds = [];
                    userIds.forEach(id => {
                        if(!previusIds.includes(id)) newIds.push(id)
                    });
                    console.log('sdjdsjfhsd fusd fu',previusIds);
                    previusIds.forEach(id => {
                        if(!userIds.includes(id)) deletedIds.push(id)
                    });
                    connection.query('delete from groups_users where group_id = ?', [groupId], async(error, results, fields) => {
                        if(error) return res.status(500).send('something went wrong');
                        await Promise.all(
                            userIds.map((_, i) => {
                                return queryPromise(
                                    `insert into groups_users (user_id, group_id) values(?, ?)`, [userIds[i], groupId]
                                );
                            })
                        ).catch(err => {
                            console.log(err);
                            return res.status(500).send('something went wrong');
                        });
                        let newChannels = [];
                        let deleteChannels = [];
                        newIds.forEach(id => {
                            newChannels.push(`private-notifications-${id}`);
                        });
                        deletedIds.forEach(id => {
                            deleteChannels.push(`private-notifications-${id}`);
                        });
                        let newEventData = {
                            'channel_name': `private-group-chat-${groupId}`,
                            'initiated_by': null,
                            'chat_with_ids'   : userIds,
                            'groupId': groupId,
                            'groupName': name,
                            'newGroup' : true
                        };
                        let deleteEventData = {
                            'groupId': groupId,
                            'groupName': name,
                            'newGroup' : true
                        };
                        if(newChannels.length > 0) await pusher.trigger(newChannels, 'group-chat-request', newEventData);
                        if(deleteChannels.length > 0) await pusher.trigger(deleteChannels, 'remove-group-chat-request', deleteEventData);

                        return res.status(200).send({m: 'updated', users: userIds, gid: groupId});
                    });
                });
            } else {
                return res.status(200).send({m: 'updated', userIds: userIds, gid: groupId});
            }
        });
    } catch(exc) {
        console.log(exc);
        return res.status(500).send('something went wrong');
    }
};

function getMessageQuery(){
    return `select m.id as mid, m.file_url as fileUrl, m.message_type as messageType, bin(m.is_edited) as isEdited, m.parent_message_id as parentMessageId,
    m.content as message, m.timestamps as time, u.id as userId, u.name as uname, 
    g.id as groupId, g.name as groupName from group_chats g 
    inner join messages m on m.group_chat_id = g.id
    inner join users u on m.from_user_id = u.id
    where session_id is null and g.id = ? order by m.id`;
 }

function getGroupsWithLatestMessageQuery(){
    return `SELECT gc.id as groupId, gc.name as groupName, latest.*
    FROM users AS u
    INNER JOIN groups_users AS gu ON u.id = gu.user_id
    INNER JOIN group_chats AS gc ON gu.group_id = gc.id
    left join (select m.id as messageId, m.content as latestMessage, m.group_chat_id, m.file_url, m.from_user_id, m.timestamps from messages m left join messages b
	on m.group_chat_id = b.group_chat_id and m.id < b.id 
	where b.id is null and m.session_id is null) latest
    on gc.id = latest.group_chat_id
    where u.id = ?
    ORDER BY gc.id desc`;
 }

 function fetchMessageWithReacts(groupId){
    return new Promise((resolve, reject) => {
        connection.query(getMessageQuery(), [groupId], (error, results, fields) => {
            let messages = results;
            let uniqueMessageIds = [...new Set( messages.map(x => x.mid))];
            let reactSql = `select * from reacts where message_id in (${uniqueMessageIds})`;
            connection.query(reactSql, async (error, reactResult, fields) => {
                if(error) reject(err);
                messages.forEach(m => {
                    m.reacts = reactResult.filter(x => x.message_id == m.mid);
                });
                return resolve(messages);
            });
        });
    });
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