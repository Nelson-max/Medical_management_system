module.exports = {
  post: {
    tags: ['User login'],
    description: 'user login',
    operationId: 'loginUser',
    parameters: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserLogin'
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'successfully signed in'
      },
      '500': {
        description: 'Server error'
      }
    }
  }
};
