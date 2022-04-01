const debug = require('debug')('log');
const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  debug(`Server Running on port ${port}`);
});

module.exports = app; // for testing
