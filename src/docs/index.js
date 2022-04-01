const basicInfo = require('./basicInfo');
const authDoc = require('./auth');
const components = require('./auth/components');

module.exports = {
  ...basicInfo,
  ...authDoc,
  ...components
};
