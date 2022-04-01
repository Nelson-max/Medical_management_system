const express = require('express');
const debug = require('debug')('log');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');

require('dotenv').config();
require('./middlewares/passport.middleware');

const connectMongoDB = require('./config/mongodb.config');
const Routes = require('./routes/index.route');
const docs = require('./docs');

connectMongoDB();
const app = express();
require('./config/admin.config');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'public/uploads'))
);

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json());

app.get('/', (req, res) => {
  debug('Medical Store Management');
  res.json('Welcome to the Medical Store Management System');
});

app.use('/api', Routes);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

module.exports = app;
