
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const {DATABASE_URL} = require('./config'); 
// const DATABASE_URL = 'mongodb://dev:devdev1@ds115022.mlab.com:15022/back-end-capstone-test';


const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const noAuthFoodsRouter = require('./routes/noauthfoods');
const jwtFoodsRouter = require('./routes/protectedfoods');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const mapsRouter = require('./routes/maps');

const app = express();
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

//Routers
app.use('/api/foods', noAuthFoodsRouter);
app.use('/api/foods', jwtFoodsRouter);

app.use('/api/users', usersRouter);
app.use('/api/', authRouter);

app.use('/api/', mapsRouter);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  console.log(err,'====', err.status, err.message);
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Listen for incoming connections
if (process.env.NODE_ENV !== 'test') {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(DATABASE_URL)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}


module.exports = app;
