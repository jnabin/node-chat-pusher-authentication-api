const reactMessage = {
    tags: ['React Message'],
    description: 'React Message',
    operationId: 'reactMessage',
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
            required: ["messageId", "userId", "reactContent", "channelName"],
            properties: {
                userId: {
                    type: 'integer',
                    example: 4
                },
                messageId: {
                    type: 'integer',
                    example: 4
                },
                channelName: {
                    type: 'string',
                    example: 'pusher-channel'
                },
                reactContent: {
                    type: 'string',
                    example: 'emoji'
                },
            }
          },
        },
      },
      required: true,
    },
    responses: {
        '201': {
          description: 'React added',
          content: {
            'application/json': {
              schema: {
                type: 'string',
                example: '3'
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

module.exports = {reactMessage}