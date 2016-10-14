// Main starting point of application
// imports
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();

// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));
router(app);

//DB Connection
mongoose.connect('mongodb://localhost:3001:auth/auth');


// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);

console.log('server listening on port:',port);
