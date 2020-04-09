'use strict';

const timestamp = (req, res, next) => {
  req.time = new Date();
  next();
};

module.exports = timestamp;