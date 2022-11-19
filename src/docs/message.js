const sendMessage = {
    tags: ['Messages'],
    description: 'Send message. Between sessionId and groupChartId, one property is required. If message type = reply then parentMessageId is required',
    operationId: 'sendMessage',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/messageBody',
          },
        },
      },
      required: true,
    },
    responses: {
        '201': {
            description: 'messaege sent successfully',
            content: {
                'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'hello john',
                        },
                        mid: {
                          type: 'integer',
                          example: '1',
                        },
                        conversationId: {
                          type: 'integer',
                          example: '1',
                        },
                        isGroup: {
                            type: 'boolean',
                            example: true
                        }
                      },
                    },
                }
            }
        },
        '500': {
            description: 'Internel server error',
        }
    }
}

const allMessage = {
    tags: ['Messages'],
    description: 'Get all messages',
    operationId: 'allMessage',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'OK',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    example: 1
                                },
                                session_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                group_chat_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                content: {
                                    type: 'string',
                                    example: 'message body'
                                },
                                from_user_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                message_type: {
                                    type: 'string',
                                    example: 'direct'
                                },
                                is_edited: {
                                    type: 'boolean',
                                    example: false
                                },
                                parent_message_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                file_url: {
                                    type: 'string',
                                    example: 'url'
                                },
                                timestamps: {
                                    type: 'string',
                                    example: '11/19/2022'
                                }
                            }
                        }
                    }
                }
            }
        },
        '500': {
            description: 'Internel server error',
        }
    }
}

const editMessage = {
    tags: ['Messages'],
    description: 'Edit message.',
    operationId: 'editMessage',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/editMessageBody',
            },
          },
        },
        required: true,
    },
    responses: {
        '200': {
            description: 'message edited',
            content: {
                'application/json':{
                    schema: {
                        type: 'object',
                        properties: {
                            content: {
                                type: "string",
                                example: 'edited message'
                            }
                        }
                    }
                }
            }
        },
        '500' : {
            description: 'something went wrong'
        }
    }
}

const getMessage = {
    tags: ['Messages'],
    description: 'Get a message',
    operationId: 'getMessage',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Message ID',
        required: true,
        type: 'string',
      },
    ],
    responses: {
        '200': {
            description: 'OK',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    example: 1
                                },
                                session_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                group_chat_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                content: {
                                    type: 'string',
                                    example: 'message body'
                                },
                                from_user_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                message_type: {
                                    type: 'string',
                                    example: 'direct'
                                },
                                is_edited: {
                                    type: 'boolean',
                                    example: false
                                },
                                parent_message_id: {
                                    type: 'integer',
                                    example: 1
                                },
                                file_url: {
                                    type: 'string',
                                    example: 'url'
                                },
                                timestamps: {
                                    type: 'string',
                                    example: '11/19/2022'
                                }
                            }
                        }
                    }
                }
            }
        },
        '500': {
            description: 'Internel server error',
        }
    }
  }

const messageBody = {
    type: 'object',
    required: [
        "fromUserId", 
        "toUserId", 
        "message", 
        'sessionId', 
        'groupChatId', 
        'userName',
        'messageType',
        'isGroup',
        'chanelName'
     ],
    properties: {
     fromUserId: {
        type: "integer",
        example: '1',
      },
      toUserId: {
          type: "integer",
          example: '2',
      },
      message: {
        type: "string",
        example: 'hello john',
      },
      sessionId: {
        type: "string",
        example: null,
      },
      groupChatId: {
        type: "string",
        example: null,
      },
      userName: {
        type: "string",
        example: 'john',
      },
      messageType: {
        type: "string",
        example: 'direct|reply'
      },
      parentMessageId: {
        type: 'integer',
        example: 1,
      },
      fileUrl: {
        type: 'string',
        example: 'http://localhost:3000/files/xyz.png',
      },
      isGroup: {
        type: 'boolean',
        example: true
      },
      chanelName: {
        type: 'string',
        example: 'pusher-channel'
      }
    },
};

const editMessageBody = {
    type: 'object',
    required: [
        "message", 
        "mid", 
        "chanelName"
    ],
    properties: {
        mid: {
            type: 'integer',
            example: 1
        },
        message: {
            type: 'string',
            example: 'demo message'
        },
        chanelName: {
            type: 'string',
            example: 'pusher-channel'
        }
    }
}

module.exports = {sendMessage, messageBody, allMessage, editMessageBody, editMessage, getMessage};