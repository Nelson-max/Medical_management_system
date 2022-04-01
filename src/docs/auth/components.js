module.exports = {
  components: {
    schemas: {
      UserInput: {
        type: 'object',
        properties: {
          names: {
            type: 'string',
            description: 'Provide your names',
            example: 'Niyitegeka Marcel'
          },
          email: {
            type: 'email',
            description: 'Provide the email',
            example: 'niyitegekamar@outlook.com'
          },
          username: {
            type: 'string',
            description: 'Provide the username',
            example: 'niyitegekamar'
          },
          password: {
            type: 'password',
            description: 'Provide the password',
            example: 'my top secrete'
          },
          confirmPassword: {
            type: 'password',
            description: 'Repeat password',
            example: 'my top secrete'
          }
        }
      },
      UserLogin: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Provide the username',
            example: 'niyitegekamar'
          },
          password: {
            type: 'password',
            description: 'Provide the password',
            example: 'my top secrete'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          internal_code: {
            type: 'string'
          }
        }
      }
    }
  },
  UserLogin: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'Provide the username',
        example: 'niyitegekamar'
      },
      password: {
        type: 'password',
        description: 'Provide the password',
        example: 'my top secrete'
      }
    }
  },
  Error: {
    type: 'object',
    properties: {
      message: {
        type: 'string'
      },
      internal_code: {
        type: 'string'
      }
    }
  }
};
