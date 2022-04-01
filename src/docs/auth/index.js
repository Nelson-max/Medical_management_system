const register = require('./register.doc');
const login = require('./login.doc');

module.exports = {
  paths: {
    '/api/auth/register': {
      ...register
    },
    '/api/auth/login': {
      ...login
    }
  }
};
