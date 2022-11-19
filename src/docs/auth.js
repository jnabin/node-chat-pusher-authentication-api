const login = {
    tags: ['Auth'],
    description: 'Login into system',
    operationId: 'loginUser',
    security: [
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
        '200': {
            description: 'OK',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                example: 'John Snow',
                            },
                            id: {
                                type: 'integer',
                                example: 1
                            },
                            accessToken: {
                                type: 'string',
                                example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
                            },
                            refreshToken: {
                                type: 'string',
                                example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
                            },
                            expiresIn: {
                                type: 'string',
                                example: '2 hours'
                            }
                        }
                    }
                }
            }
        },
        '400': {
            description: 'Validation Error',
            content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'invalid username/password',
                      },
                    },
                  },
                },
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
        }
    }
};

const token = {
    tags: ['Auth'],
    description: 'Refresh token',
    operationId: 'newToken',
    security: [
    ],
    requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/tokenBody',
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
                            accessToken: {
                                type: 'string',
                                example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
                            }
                        }
                    }
                }
            }
        },
        '401': {
            description: 'Unauthorize',
        },
        '403': {
            description: 'Access Forbidden',
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
        }
    }
};

const logout = {
    tags: ['Auth'],
    description: 'Logout from system',
    operationId: 'logoutUser',
    security: [
        {
            bearerAuth: [],
        }
    ],
    responses: {
        '204': {
            description: 'OK'
        }
    }
}

const tokenBody = {
    type: 'object',
    required: ["token"],
    properties: {
      token: {
        type: "string",
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    },
  };

module.exports = {login, logout, tokenBody, token}