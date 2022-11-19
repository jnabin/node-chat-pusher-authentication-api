const user = require('./users');
const auth = require('./auth');
const message = require('./message');
const session = require('./session');
const group = require('./group');
const pusher = require('./pusher');
const react = require('./react');
const createUserBody = user.createUserBody;
const messageBody = message.messageBody;
const tokenBody = auth.tokenBody;
const editMessageBody = message.editMessageBody;
const sessionBody = session.sessionBody;
const sessionBody2 = session.sessionBody2;
const sessionMessageResponse = session.sessionMessageResponse;
const reactResponse = session.reactResponse;
const groupMessageResponse = group.groupMessageResponse;
const groupResponse = group.groupResponse;
const groupWithLatestMessage = group.groupWithLatestMessage;

const apiDocumentation = {
    openapi: '3.0.1',
    info: {
      version: '1.3.0',
      title: 'PusherChat REST API - Documentation',
      description: 'Description of my API here',
      termsOfService: '',
      contact: {
        name: 'Nabin',
        email: 'jahangirnabin2@gmail.com',
        url: '',
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Local Server',
      },
    ],
    tags: [
      {
        name: 'Auth',
      },
      {
        name: 'Users',
      },
      {
        name: 'Messages'
      },
      {
        name: 'React Message'
      },
      {
        name: 'Sessions'
      },
      {
        name: 'Groups'
      },
      {
        name: 'Pusher'
      }
    ],
    paths: {
        '/login': {
          post: auth.login
        },
        '/logout': {
          get: auth.logout
        },
        '/token': {
          post: auth.token
        },
        'users/{id}': {
          get: user.getUser,
        },
        '/users': {
          post: user.createUser,
          get: user.allUsers
        },
        '/messages': {
          post: message.sendMessage,
          get: message.allMessage,
          put: message.editMessage
        },
        '/messages/{id}': {
          get: message.getMessage,
        },
        '/sessions': {
          post: session.sessionWithMessages
        },
        '/sessionMessages': {
          post: session.sessionMessageFromEvent
        },
        '/groupMessages': {
          post: group.groupMessages
        },
        '/groupMessagesWithChannel': {
          post: group.groupMessageWithEvent
        },
        '/groups': {
          get: group.allGroups,
          post: group.createGroup,
          put: group.updateGroup,
          delete: group.deleteGroup
        },
        '/groups/{id}': {
          get: group.getGroup
        },
        '/usersByGroup/{id}': {
          get: group.usersByGroup
        },
        '/groupsByUser/{id}': {
          get: group.groupsByUser
        },
        '/userTyping': {
          post: pusher.userTyping
        },
        '/pusher/auth': {
          post: pusher.authorizePusher
        },
        '/pusher/user-auth': {
          post: pusher.authenticatePusher
        },
        '/reacts': {
          post: react.reactMessage
        }
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          createUserBody,
          tokenBody,
          messageBody,
          editMessageBody,
          sessionBody,
          sessionBody2,
          sessionMessageResponse,
          reactResponse,
          groupMessageResponse,
          groupResponse,
          groupWithLatestMessage
        },
      },
  };
  
  module.exports = { apiDocumentation };