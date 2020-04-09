'use strict';

const server = require('./lib/server.js');

let port = process.env.PORT || 3000;
server.start(port);