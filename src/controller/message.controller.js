const connection = require('../../conn');
const pusher = require('../../config');

const sendMessage = async(req, res) => {
    const fromUserId = req.body.fromUserId;
    const toUserId = req.body.toUserId;
    const message = req.body.message;
    const sessionId = req.body.sessionId;
    const groupChartId = req.body.groupChatId;
    const userName = req.body.username;
    const messageType = req.body.messageType;
    const parentMessageId = req.body.parentMessageId;
    const fileUrl = req.body.fileUrl;
    const isGroup = req.body.isGroup;
    const channelName = req.body.chanelName ? req.body.chanelName : getPrivateChanelFromUsersId(fromUserId, toUserId);

    let event = sessionId == null ? `group-new-message` : `new-message-to-${toUserId}`;
    await pusher.trigger('presence-forum', event, {
        fromUserId: fromUserId,
        groupId: groupChartId,
        message: message,
        fileUrl: fileUrl,
        isGroup: sessionId == null
    });

    connection.query(insertMessageQuery(), 
    [sessionId, groupChartId, message, fromUserId, messageType, parentMessageId, fileUrl], 
    async(error, results, fields) => {
        if (error) return res.status(500).send("something went wrong");

        let sql = "insert into chats (session_id, message_id, user_id, type) values(?, ?, ?, ?)"
        const mid = results.insertId;

        await pusher.trigger(channelName, "message", {
            fromUserId: fromUserId,
            toUserId: toUserId,
            message: message,
            messageId: mid,
            userName: userName,
            messageType: messageType,
            parentMessageId: parentMessageId,
            fileUrl: fileUrl
        }).catch(err => {
            console.log(err);
            return res.status(500).send('something went wrong');
        });

        if(sessionId == null) return res.status(201).send({message: message, mid: mid, conversationId: isGroup ? groupChartId : toUserId, isGroup: isGroup});

        else {
            connection.query(sql, [sessionId, mid, fromUserId, 0], 
                (error, results, fields) => {
                    if (error) return res.status(500).send('something went wrong');
                    connection.query(sql, [sessionId, mid, toUserId, 1], 
                        (error, results, fields) => {
                            if (error) return res.status(500).send('something went wrong');
                            return res.status(201).send({message: message, mid: mid, conversationId: isGroup ? groupChartId : toUserId, isGroup: isGroup});
                        });
                });
        }

    });

};

const allMessages = (req, res) => {
    connection.query('select id, chat_room_id, user_id, message from chat_messages', (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(200).send(results);
    });
};

const getMessage = (req, res) => {
    connection.query('select  id, chat_room_id, user_id, message from chat_messages where id = ?', 
                    [req.params.id], (error, results, fields) => {
        if(error) return res.status(500).send('something went wrong');
        return res.status(200).send(results);
    });
};

const updateMessage = (req, res) => {
    const message = req.body.message;
    const mid = req.body.mid;
    const channelName = req.body.chanelName;
    
    let sql = `update messages set content = ?, is_edited = 1 where id = ?`;
    try{
        connection.query(sql, [message, mid], async(error, result, fields) => {
            if(error) return res.status(500).send('something went wrong');
            else {
                await pusher.trigger(channelName, "edit-message", {
                    updatedMessage: message,
                    mid: mid
                }).catch(err => {
                    console.log(err);
                    return res.status(500).send('something went wrong');
                });
                return res.status(200).send({content: message});
            } 
        });
    } catch(exc) {
        console.log(exc);
        return res.status(500).send('something went wrong');
    }
};

function insertMessageQuery(){
    return `insert into messages (session_id, group_chat_id, content, from_user_id, message_type, parent_message_id, file_url) 
            values(?, ?, ?, ?, ?, ?, ?)`;
}

function getPrivateChanelFromUsersId(userOneId, userTwoId){
    return userOneId > userTwoId ? `private-chat-${userOneId}-${userTwoId}` : `private-chat-${userTwoId}-${userOneId}`;
 }

module.exports = {
    sendMessage,
    allMessages,
    getMessage,
    updateMessage
  };