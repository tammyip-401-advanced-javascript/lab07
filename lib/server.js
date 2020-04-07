'use strict';

const express = require('express');

let data = require('../db.json');
const notFound = require('./middleware/404.js');
const timestamp = require('./middleware/timestamp.js');
const logger = require('./middleware/logger.js');
const serverError = require('./middleware/500.js');

// Define our server as "app"
// express() creates a server object with a lot of junk
const app = express();

// Application Middleware
app.use(express.json());
app.use(timestamp);
app.use(logger);

const startServer = (port) => {
  // check is server already running?
  // check if port is valid

  // call callback anon function when server is successfully running
  app.listen(port, () => {
    console.log('Server is up and running on port', port);
  });
};

// browser is making a request to GET / === GET http://localhost:3000/
// currently, browser is not getting a response! Let's write one

/**
 * This route gives you a standard "Homepage" message
 * @route GET /
 * @param {string} name.query - a name field which adds a welcome message
 * @returns {object} 200 - The HTML to show on the homepage
 */
app.get('/', (req, res, next) => {
  let homeHTML = '<div><h1>Homepage</h1>';

  if (req.query.name)
    homeHTML += '<h3>Welcome ' + req.query.name + '!</h3></div>';
  else homeHTML += '</div>';

  // return res to the client
  res.status(200);
  res.send(homeHTML);
});

app.get('/throw-err', (req, res, next) => {
  next('this is my error');
});

/**
 * This route allows you to create a fruit
 * @route POST /fruits
 * @group fruits
 * @returns {object} 201 - The created object
 * @returns {Error} - If there was an issue creating in the db
 */
app.post('/fruits', (req, res, next) => {
  // what we want to make
  // is probably in req.body

  // get the object from req.body (it probably won't have id)
  let newFruit = req.body;

  // add the id key value by setting the id equal to
  // the number of fruits + 1
  newFruit.id = data.fruits.length + 1;

  // push this new fruit to our in-memory data ("save" the record)
  data.fruits.push(newFruit);

  // send the new record we created back to client to verify
  res.status(201);
  res.send(newFruit);
});

// Read - GET
app.get(
  '/fruits',
  (req, res, next) => {
    console.log('attempting to get fruits');
    next();
  },
  (req, res, next) => {
    console.log('continuing the attempt');
    next();
  },
  (req, res, next) => {
    res.send(data.fruits);
  },
);

/**
 * This route allows you to update a fruit
 * @route PUT /fruits/:id
 * @group fruits
 * @param {Number} id.params.required - the id of the field you want to update
 * @returns {object} 200 - The updated object
 * @returns {Error} - If there was an issue updating in the db
 */
app.put('/fruits/:id', (req, res, next) => {
  data.fruits[parseInt(req.params.id) - 1] = {
    ...req.body,
    id: parseInt(req.params.id),
  };

  res.send(data.fruits[parseInt(req.params.id) - 1]);
});

// Delete - DELETE
app.delete('/fruits/:id', (req, res, next) => { });

// Categories Routes
// Create - POST
app.post('/vegetables', (req, res, next) => { });

// Read - GET
app.get('/vegetables', (req, res, next) => { });

// Update - PUT/PATCH
app.put('/vegetables/:id', (req, res, next) => { });

// Delete - DELETE
app.delete('/vegetables/:id', (req, res, next) => { });

app.use('*', notFound);
app.use(serverError);

module.exports = {
  server: app,
  start: startServer,
};
