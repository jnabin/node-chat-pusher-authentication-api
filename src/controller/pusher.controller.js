const pusher = require('../../config');

const userTyping = function(req, res) {
    const username = req.body.username;
    const fromUser = req.body.fromUserId;
    const channelName = req.body.chanelName ? req.body.chanelName : getPrivateChanelFromUsersId(fromUserId, toUserId);

    pusher.trigger([channelName, 'presence-forum'], 'user_typing', {username: username, userId: fromUser});
    res.status(200).send();
};

const authorizePusher = (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const user_id = req.body.user_id;
    const name = req.body.name;

    if (channel.startsWith('presence-')) {

        const presenceData = {
            user_id: user_id,
            user_info: { name: name, user_id: user_id },
        };

        const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
        res.status(200).send(authResponse);
    } else {
        const authResponse = pusher.authorizeChannel(socketId, channel);
        res.status(200).send(authResponse);
    }
}

const authenticatePusher = (req, res) => {
    const socketId = req.body.socket_id;
    const user_id = req.body.user_id;
    const name = req.body.name;
    const user = {
      id: user_id,
      user_info: {
        name: name,
      }
    };
    const authResponse = pusher.authenticateUser(socketId, user);
    res.status(200).send(authResponse);
  }

function getPrivateChanelFromUsersId(userOneId, userTwoId){
    return userOneId > userTwoId ? `private-chat-${userOneId}-${userTwoId}` : `private-chat-${userTwoId}-${userOneId}`;
}

module.exports = {
    userTyping,
    authorizePusher,
    authenticatePusher
}