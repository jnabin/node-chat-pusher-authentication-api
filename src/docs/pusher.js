const userTyping = {
    tags: ['Pusher'],
    description: 'Usertyping event',
    operationId: 'userTyping',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ["username", "fromUserId", "chanelName"],
              properties: {
                username: {
                  type: "string",
                  example: 'John Snow',
                },
                fromUserId: {
                    type: "integer",
                    example: '3',
                },
                chanelName: {
                    type: 'string',
                    example: 'pusher-channel'
                }
              },
            },
          },
        },
        required: true,
    },
    responses: {
        '200': {
          description: 'typing event sent',
        },
        '500': {
          description: 'something went wrong',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'something went wrong',
                  },
                },
              },
            },
          },
        },
      },
}

const authorizePusher = {
    tags: ['Pusher'],
    description: 'Authorize pusher',
    operationId: 'authorizePusher',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ["socket_id", "channel_name", "user_id", "name"],
              properties: {
                channel_name: {
                  type: "string",
                  example: 'pusher channel name',
                },
                socket_id: {
                    type: "string",
                    example: 'puser socket id',
                },
                user_id: {
                    type: 'integer',
                    example: 1
                },
                name: {
                    type: 'string',
                    example: 'john'
                }
              },
            },
          },
        },
        required: true,
    },
    responses: {
        '200': {
          description: 'OK',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                  properties: {
                    auth: {
                      type: 'string'
                    },
                    channel_data: {
                      type: 'string',
                    },
                    shared_secret: {
                      type: 'string',
                    },
                  },
              },
            },
          },
        },
        '500': {
          description: 'something went wrong',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'something went wrong',
                  },
                },
              },
            },
          },
        },
      },
}

const authenticatePusher = {
    tags: ['Pusher'],
    description: 'Authenticate pusher',
    operationId: 'authenticatePusher',
    security: [

    ],
    requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ["socket_id", "user_id", "name"],
              properties: {
                socket_id: {
                    type: "string",
                    example: 'puser socket id',
                },
                user_id: {
                    type: 'integer',
                    example: 1
                },
                name: {
                    type: 'string',
                    example: 'john'
                }
              },
            },
          },
        },
        required: true,
    },
    responses: {
        '200': {
          description: 'typing event sent',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                  properties: {
                    auth: {
                      type: 'string'
                    },
                    user_data: {
                      type: 'string',
                    },
                  },
              },
            },
          },
        },
        '500': {
          description: 'something went wrong',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'something went wrong',
                  },
                },
              },
            },
          },
        },
      },
}

module.exports = {userTyping, authorizePusher, authenticatePusher}