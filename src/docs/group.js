const groupMessages = {
    tags: ['Groups'],
    description: 'Get group with messages. When there is pusher event for group chat',
    operationId: 'getMessagesOfGroup',
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
            required: ["groupId"],
            properties: {
                groupId: {
                    type: 'integer',
                    example: 1
                }
            }
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
                            messages: {
                                type: "array",
                                items: {
                                    $ref: '#/components/schemas/groupMessageResponse',
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

const groupMessageWithEvent = {
    tags: ['Groups'],
    description: 'Get group with messages. When there is not pusher event for group chat',
    operationId: 'getMessagesGroup',
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
            required: ["groupId", "userIds", "fromUserId"],
            properties: {
                groupId: {
                    type: 'integer',
                    example: 1
                },
                userIds: {
                    type: 'array',
                    items: {
                        type: "integer",
                        example: 1
                    }
                },
                fromUserId: {
                    type: "integer",
                    example: 2
                }
            }
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
                            messages: {
                                type: "array",
                                items: {
                                    $ref: '#/components/schemas/groupMessageResponse',
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

const allGroups = {
    tags: ['Groups'],
  description: 'Get all Groups',
  operationId: 'getAllGroups',
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
                $ref: '#/components/schemas/groupResponse',
            },
          },
        },
      },
    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
}

const groupsByUser = {
    tags: ['Groups'],
  description: 'Get all Groups',
  operationId: 'getAllGroups',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'integer',
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
                        example: 2
                    },
                    name: {
                        type: 'string',
                        example: 'john'
                    }
                }
            },
          },
        },
      },
    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
}

const deleteGroup = {
    tags: ['Groups'],
  description: 'Delete group',
  operationId: 'deleteGroup',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'integer',
    },
  ],
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'string',
            example: 'created'
          }
        }
      }

    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
}

const createGroup = {
    tags: ['Groups'],
    description: 'Create new group',
    operationId: 'createGroup',
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
            required: ["userIds", "fromUserId", "name"],
            properties: {
                userIds: {
                    type: 'array',
                    items: {
                        type: 'integer',
                        example: 1
                    }
                },
                fromUserId: {
                    type: 'integer',
                    example: 4
                },
                name: {
                    type: 'string',
                    example: 'new group'
                }
            }
          },
        },
      },
      required: true,
    },
    responses: {
        '201': {
          description: 'new group created',
          content: {
            'application/json': {
              schema: {
                type: 'string',
                example: '2'
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

const updateGroup = {
    tags: ['Groups'],
    description: 'Update group',
    operationId: 'updateGroup',
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
            required: ["groupId", "userIds", "name", "isUpdateUsers"],
            properties: {
                userIds: {
                    type: 'array',
                    items: {
                        type: 'integer',
                        example: 1
                    }
                },
                fromUserId: {
                    type: 'integer',
                    example: 4
                },
                groupId: {
                    type: 'integer',
                    example: 4
                },
                name: {
                    type: 'string',
                    example: 'new group'
                },
                isUpdateUsers: {
                    type: 'boolean',
                    example: true
                },
            }
          },
        },
      },
      required: true,
    },
    responses: {
        '201': {
          description: 'new group created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                    m: {
                        type: 'string',
                        example: 'updated'
                    },
                    users: {
                        type: 'array',
                        items: {
                            type: 'integer',
                            example: 2
                        }
                    },
                    gid: {
                        type: 'integer',
                        example: 4
                    }
                }
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

const usersByGroup = {
    tags: ['Groups'],
  description: 'Get all Users from Group',
  operationId: 'getAllUsers',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'integer',
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
                $ref: '#/components/schemas/groupWithLatestMessage',
            },
          },
        },
      },
    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
}

const getGroup = {
    tags: ['Groups'],
    description: 'Get a group',
    operationId: 'getGroup',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Group ID',
        required: true,
        type: 'integer',
      },
    ],
    responses: {
      '200': {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
                $ref: '#/components/schemas/groupResponse',
            },
          },
        },
      },
      '500': {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Internal Server Error',
                },
              },
            },
          },
        },
      },
    },
}

const groupMessageResponse = {
    type: 'object',
    properties: {
        userId: {
          type: "integer",
          example: 1,
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
        groupId: {
            type: 'integer',
            example: 1
        },
        groupName: {
            type: 'string',
            example: 'new froup'
        }
      },
}

const groupWithLatestMessage = {
    type: "object",
    properties: {
        groupId: {
            type: "integer",
            example: 1
        },
        groupName: {
            type: "string",
            example: "new group"
        },
        messageId: {
            type: 'integer',
            example: 1
        },
        latestMessage: {
            type: "string",
            example: "latest message"
        },
        group_chat_id: {
            type: 'integer',
            example: 1
        },
        file_url: {
            type: 'string',
            example: 'attachment url'
        },
        from_user_id: {
            type: 'integer',
            example: 2
        },
        timestamps: {
            type: 'string',
            example: '2022-11-17 11:58:59'
        },
        users: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1
                    },
                    name: {
                        type: 'string',
                        example: 'jhon'
                    },
                    groupId: {
                        type: 'integer',
                        example: 4
                    }
                }
            }
        }
    }
}

const groupResponse = {
    type: 'object',
    properties: {
        groupId: {
            type: 'integer',
            example: 1,
        },
        groupName: {
            type: 'string',
            example: 'new group',
        },
        userId: {
            type: 'integer',
            example: 1,
        },
        groupName: {
            type: 'string',
            example: 'new group',
        },
        userName: {
            type: 'string',
            example: 'user name',
        },
    }
}

  module.exports = {
    groupMessageResponse, 
    groupMessages, 
    groupMessageWithEvent, 
    allGroups,
    groupResponse,
    groupWithLatestMessage,
    getGroup,
    groupsByUser,
    deleteGroup,
    createGroup,
    updateGroup,
    usersByGroup
}