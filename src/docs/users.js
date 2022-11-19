const createUser = {
    tags: ['Users'],
    description: 'Create new user in the system',
    operationId: 'createUser',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/createUserBody',
          },
        },
      },
      required: true,
    },
    responses: {
      '201': {
        description: 'User created successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: '1',
                },
                name: {
                  type: 'string',
                  example: 'John Snow',
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
};
  
const createUserBody = {
  type: 'object',
  required: ["name", "password"],
  properties: {
    name: {
      type: "string",
      example: 'John Snow',
    },
    password: {
        type: "string",
        example: '123456',
    },
  },
};

const getUser = {
  tags: ['Users'],
  description: 'Get a user',
  operationId: 'getUser',
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
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              name: {
                type: 'string',
                example: 'John Snow',
              },
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

const allUsers = {
  tags: ['Users'],
  description: 'Get all users',
  operationId: 'getUsers',
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
                  example: 1,
                },
                name: {
                  type: 'string',
                  example: 'John Snow',
                },
              },
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

module.exports = { createUser, createUserBody, getUser, allUsers};