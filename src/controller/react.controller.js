const connection = require('../../conn');
const pusher = require('../../config');

const react = async(req, res) => {
    const messageId = req.body.messageId;
    const userId = req.body.userId;
    const reactContent = req.body.reactContent;
    const channelName = req.body.channelName;

    let sql = `insert into reacts (react_content, message_id, user_id) values(?, ?, ?)`;
    connection.query(sql, [reactContent, messageId, userId], async(error, results, fields) => {
        if(error) return res.status(500).send("something went wrong");

        await pusher.trigger(channelName, "react-message", {
           userId:  userId,
           react_content: reactContent,
           messageId: messageId
        }).catch(err => {
            return res.status(500).send('something went wrong');
        });

        return res.status(201).send(results.insertId.toString());
    });
}

module.exports = {
    react
};