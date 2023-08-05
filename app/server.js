const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request')
const session = require('express-session');
const ejs = require('ejs')
const CryptoJS = require("crypto-js")
const fs = require('fs')
const format = require('date-format');

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
const { sequelize } = require('./models/index');


const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',    
  ],
};
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(session({
  secret: 'x09ajustice',
  saveUninitialized: true,
  resave: true
}));
app.use(cors(corsOpts));
// Settings 
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas  
app.use(require('./routes'));

app.listen(PORT, function () {
  console.log(`Example app listening on http://localhost:${PORT}`);
  sequelize.authenticate().then(() => {
      console.log('Database konnek');
  })
});

app.on('error', onError);
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
app.use(function(req, res, next) {
  res.status(404).json({
    'status': 'error',
    'messages': 'Not Found',
    'result': ''
  })
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({
    'status': 'error',
    'messages': res.locals.message,
    'result': res.locals.error
  })
});
