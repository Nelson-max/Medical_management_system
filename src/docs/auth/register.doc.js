module.exports = {
  post: {
    tags: ['User registration'],
    description: 'Create user',
    operationId: 'CreateUser',
    parameters: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserInput'
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'User created successfully'
      },
      '500': {
        description: 'Server error'
      }
    }
  }
};
