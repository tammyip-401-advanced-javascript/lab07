'use strict';

//emits a console log with the API path, method, and request time
const logger = (req, res, next) => {
  console.log('request made to', req.method, req.url, 'at', req.time);
  next();
};

module.exports = logger;