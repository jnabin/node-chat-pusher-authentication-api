const sessionWithMessages = {
    tags: ['Sessions'],
    description: 'Get sessions with messages. When there is no pusher event for one to one chat',
    operationId: 'getMessagesOfSession',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/sessionBody',
          },
        },
      },
      required: true,
    },
    responses: {
        '200': {
            description: 'Success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: "integer",
                                example: 1
                            },
                            messages: {
                                type: "array",
                                items: {
                                    $ref: '#/components/schemas/sessionMessageResponse',
                                }
                            }
                        }
                    }
                }
            }
        },
        '201': {
            description: 'session created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: "integer",
                                example: 1
                            },
                            messages: {
                                type: "array",
                                items: {
                                    type: 'object',
                                    properties: null
                                }
                            }
                        }
                    }
                }
            }
        },
        '500': {
            description: 'internel server error!'
        }
    }
}

const sessionMessageFromEvent = {
    tags: ['Sessions'],
    description: 'Get sessions with messages. When there is pusher event for one to one chat',
    operationId: 'getMessagesSession',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/sessionBody2',
          },
        },
      },
      required: true,
    },
    responses: {
        '200': {
            description: 'Success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: "integer",
                                example: 1
                            },
                            messages: {
                                type: "array",
                                items: {
                                    $ref: '#/components/schemas/sessionMessageResponse',
                                }
                            }
                        }
                    }
                }
            }
        },
        '201': {
            description: 'session created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: "integer",
                                example: 1
                            },
                            messages: {
                                type: "array",
                                items: {
                                    type: 'object',
                                    properties: null
                                }
                            }
                        }
                    }
                }
            }
        },
        '500': {
            description: 'internel server error!'
        }
    }
}

const sessionBody = {
    type: 'object',
    required: ["user_one_id", "user_two_id", "from_user_id", "to_user_id"],
    properties: {
      user_one_id: {
        type: "integer",
        example: 1,
      },
      user_two_id: {
        type: "integer",
        example: 2,
      },
      from_user_id: {
        type: "integer",
        example: 1,
      },
      to_user_id: {
        type: "integer",
        example: 2,
      },
    },
};

const sessionBody2 = {
    type: 'object',
    required: ["user_one_id", "user_two_id"],
    properties: {
      user_one_id: {
        type: "integer",
        example: 1,
      },
      user_two_id: {
        type: "integer",
        example: 2,
      },
    },
};

const reactResponse = {
    type: 'object',
    properties: {
        id : {
            type: 'integer',
            example: 1
        },
        react_content: {
            type: 'string',
            example: 'emoji'
        },
        message_id: {
            type: 'integer',
            example: 2
        },
        user_id: {
            type: 'integer',
            example: 5
        },
        timestamps: {
            type: 'string',
            example: '2022-11-17 11:58:59'
        }
    }
}

  const sessionMessageResponse = {
    type: 'object',
    properties: {
        cid: {
          type: "integer",
          example: 1,
        },
        userid: {
          type: "integer",
          example: 1,
        },
        usertype: {
          type: "integer",
          example: 0,
        },
        mid: {
          type: "integer",
          example: 1,
        },
        reacts:{
            type: "array",
            items: {
                $ref: '#/components/schemas/reactResponse',
            }
        },
        fileUrl: {
            type: 'string',
            example: 'file url'
        },
        isEdited: {
            type: "integer",
            example: '1'
        },
        messageType: {
            type: 'string',
            example: 'direct'
        },
        parentMessageId: {
            type: 'integer',
            example: 1
        },
        time: {
            type: 'string',
            example: '11/19/2022'
        },
        uname: {
            type: 'string',
            example: 'Nabin'
        },
        message: {
            type: 'string',
            example: 'message body'
        },
        sessionId: {
            type: 'integer',
            example: 1
        }
      },
  }

  module.exports = {sessionBody, sessionBody2, sessionWithMessages, sessionMessageResponse, sessionMessageFromEvent, reactResponse}