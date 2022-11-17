const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fileController = require('../controller/file.controller');
const messageController = require('../controller/message.controller');
const groupController = require('../controller/group.controller');
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');
const pusherController = require('../controller/pusher.controller');
const reactController = require('../controller/react.controller');
const privateConversationController = require('../controller/private-conversation.controller');
const authenticateToken = auth.authenticateToken;

let routes = (app) => {
    router.post("/upload", authenticateToken, fileController.upload);
    router.get("/files", authenticateToken, fileController.getListFiles);
    router.get("/files/:name", fileController.download);

    router.post('/messages', authenticateToken, messageController.sendMessage);
    router.get('/messages', authenticateToken, messageController.allMessages);
    router.get('/messages/:id', authenticateToken, messageController.getMessage);
    router.put('/messages', authenticateToken, messageController.updateMessage);

    router.post("/groupMessages", authenticateToken, groupController.groupMessages);
    router.post("/groupMessagesWithChannel", authenticateToken, groupController.groupMessagesWithChannel);
    router.get('/groups', authenticateToken, groupController.groups);
    router.get('/groups/:id', authenticateToken, groupController.getGroup);
    router.get('/usersByGroup/:id', authenticateToken, groupController.usersByGroup);
    router.get('/groupsByUser/:id', authenticateToken, groupController.groupsByUser);
    router.delete('/groups/:id', authenticateToken, groupController.deleteGroup);
    router.post('/groups', authenticateToken, groupController.createGroup);
    router.put('/groups', authenticateToken, groupController.updateGroup);

    router.post("/sessions", authenticateToken, privateConversationController.privateMessages);
    router.post("/sessionMessages", authenticateToken, privateConversationController.requestPrivateMessage);

    router.get('/users', authenticateToken, userController.allUsers);
    router.get('/usersWithLatestMessage/:id', authenticateToken, userController.userWithLatestMessage);
    router.get('/users/:id', authenticateToken, userController.getUser);
    router.delete('/users/:id', authenticateToken, userController.deleteUser);
    router.post('/users', userController.createUser);

    router.post('/login', authController.login);
    router.delete('/logout', authenticateToken, authController.logout);
    router.post('/token', authController.createToken);

    router.post('/userTyping', authenticateToken, pusherController.userTyping);
    router.post("/pusher/auth", pusherController.authorizePusher);
    router.post("/pusher/user-auth", pusherController.authenticatePusher);

    router.post('/reacts', authenticateToken, reactController.react);

    app.use(router);
};
  
module.exports = routes;