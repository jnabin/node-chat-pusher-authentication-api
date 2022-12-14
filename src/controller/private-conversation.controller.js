const connection = require('../../conn');
const pusher = require('../../config');

const privateMessages = async(req, res) => {
    const user_one_id = req.body.user_one_id;
    const user_two_id = req.body.user_two_id;
    const from_user_id = req.body.from_user_id;
    const to_user_id = req.body.to_user_id;

    let channels = [ `private-notifications-${user_one_id}`, `private-notifications-${user_two_id}` ];
    let eventData = {
                    'channel_name': getPrivateChanelFromUsersId(user_one_id, user_two_id),
                    'initiated_by': from_user_id,
                    'chat_with'   : to_user_id
                    };

    await pusher.trigger( channels, 'one-to-one-chat-request', eventData ).then(s => {
        connection.query('select * from sessions where user1_id in (?, ?) and  user2_id in (?, ?)', 
                        [user_one_id, user_two_id, user_one_id, user_two_id], (error, result, fields) => {
            if(result.length > 0) {
                fetchMessageWithReacts(result[0]).then(messages => {
                    return res.status(200).send({id: result[0].id, messages: messages});
                }).catch(err => {
                    return res.status(500).send('something went wrong');
                });
        
            } else {
                connection.query("insert into sessions (user1_id, user2_id) values(?, ?)", 
                                [user_one_id, user_two_id], (error, results, fields) => {
                    if (error) return res.status(500).send("something went wrong");
                    return res.status(201).send({id: results.insertId, messages: []});
                });
            }
        });
    }).catch(e => {
        return res.status(500).send('something went wrong');
    });
};

const requestPrivateMessage = (req, res) => {
    const user_one_id = req.body.user_one_id;
    const user_two_id = req.body.user_two_id;

    connection.query('select * from sessions where user1_id in (?, ?) and  user2_id in (?, ?)', 
                    [user_one_id, user_two_id, user_one_id, user_two_id], (error, result, fields) => {
        if(result.length > 0) {
            fetchMessageWithReacts(result[0]).then(messages => {
                return res.status(200).send({id: result[0].id, messages: messages});
            }).catch(err => {
                return res.status(500).send('something went wrong');
            });
    
        } else {
            connection.query("insert into sessions (user1_id, user2_id) values(?, ?)", 
                            [user_one_id, user_two_id], (error, results, fields) => {
                if (error) return res.status(500).send("something went wrong");
                return res.status(201).send({id: results.insertId, messages: []});
            });
        }
    });
};

function getOneToOneMessageQuery(){
    return `select chat.id as cid, chat.user_id as userid, chat.type as usertype, m.id as mid, m.file_url as fileUrl, bin(m.is_edited) as isEdited,
    m.message_type as messageType, m.parent_message_id as parentMessageId, m.timestamps as time, u.name as uname,
    m.content as message, s.id as sessionId from chats chat inner join messages m on chat.message_id = m.id
    inner join users u on m.from_user_id = u.id inner join sessions s on chat.session_id = s.id where s.id = ? order by m.id`;
}

function fetchMessageWithReacts(session){
    return new Promise((resolve, reject) => {
        connection.query(getOneToOneMessageQuery(), [session.id], (error, results, fields) => {
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

function getPrivateChanelFromUsersId(userOneId, userTwoId){
    return userOneId > userTwoId ? `private-chat-${userOneId}-${userTwoId}` : `private-chat-${userTwoId}-${userOneId}`;
}

module.exports = {
    privateMessages,
    requestPrivateMessage
}