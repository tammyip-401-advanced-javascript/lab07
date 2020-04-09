'use strict';

const express = require('express');

let data = require('../db.json');
const notFound = require('./middleware/404.js');
const timestamp = require('./middleware/timestamp.js');
const logger = require('./middleware/logger.js');
const serverError = require('./middleware/500.js');
const generateSwagger = require('../docs/swagger.js');

// Define our server as "app"
// express() creates a server object with a lot of junk
const app = express();

generateSwagger(app);

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
  let homeHTML = '<div><h1>Store Homepage</h1>';

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
 * This route allows you to create a category
 * @route POST /categories
 * @group categories
 * @returns {object} 201 - The created object
 * @returns {Error} - If there was an issue creating in the db
 */
app.post('/categories', (req, res, next) => {
  // what we want to make
  // is probably in req.body

  // get the object from req.body (it probably won't have id)
  let newCategory = req.body;

  // add the id key value by setting the id equal to
  // the number of fruits + 1
  newCategory.id = data.categories.length + 1;

  // push this new fruit to our in-memory data ("save" the record)
  data.categories.push(newCategory);

  // send the new record we created back to client to verify
  res.status(201);
  res.send(newCategory);
});

// Read - GET
app.get(
  '/categories',
  (req, res, next) => {
    console.log('attempting to get categories');
    next();
  },
  (req, res, next) => {
    console.log('continuing the attempt');
    next();
  },
  (req, res, next) => {
    res.send(data.categories);
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
app.put('/categories/:id', (req, res, next) => {
  data.categories[parseInt(req.params.id) - 1] = {
    ...req.body,
    id: parseInt(req.params.id),
  };

  // full replace foundRecord with request.body
  let modifiedRecord = req.body;
  modifiedRecord.id = req.params.id;

  //replace in database
  data.categories[req.params.id - 1] = modifiedRecord;
  res.send(modifiedRecord);
  // res.send(data.categories[parseInt(req.params.id) - 1]);
},
  notFound,
);

app.patch('/categories/:id', (req, res, next) => {
  // the goal of patch
  // a merge-update - we are given pieces of the object
  // some key-values, and we want to merge with existing
  // record, replacing ONLY the keys that are duplicates

  // in request.body
  // { count: 15 }

  // find existing record
  let foundRecord = data.categories[req.params.id - 1];

  // merge with req.body
  let modifiedRecord = { ...foundRecord, ...req.body };

  // replace in database
  data.categories[req.params.id - 1] = modifiedRecord;
  res.send(modifiedRecord);
});

// Delete - DELETE
app.delete('/categories/:id', (req, res, next) => {
  let categories = data.categories;

  data.categories = categories.filter((val) => {
    if (val.id === parseInt(req.params.id)) return false;
    else return true;
  });

  res.send(data.categories);
});

// Products Routes
// Create - POST
app.post('/products', (req, res, next) => {
  let newProduct = req.body;

  newProduct.id = data.products.length + 1;

  data.products.push(newProduct);

  res.status(201);
  res.send(newProduct);
});

// Read - GET
app.get('/products', (req, res, next) => {
  console.log('attempting to get products');
  next();
},
  (req, res, next) => {
    console.log('continuing the attempt');
    next();
  },
  (req, res, next) => {
    res.send(data.products);
  },
);

// Update - PUT/PATCH
app.put('/products/:id', (req, res, next) => {
  data.products[parseInt(req.params.id) - 1] = {
    ...req.body,
    id: parseInt(req.params.id),
  };

  // full replace foundRecord with request.body
  let modifiedRecord = req.body;
  modifiedRecord.id = req.params.id;

  //replace in database
  data.products[req.params.id - 1] = modifiedRecord;
  res.send(modifiedRecord);
  // res.send(data.categories[parseInt(req.params.id) - 1]);
},
  notFound,
);

app.patch('/products/:id', (req, res, next) => {

  // find existing record
  let foundRecord = data.products[req.params.id - 1];

  // merge with req.body
  let modifiedRecord = { ...foundRecord, ...req.body };

  // replace in database
  data.products[req.params.id - 1] = modifiedRecord;
  res.send(modifiedRecord);
});

// Delete - DELETE
app.delete('/products/:id', (req, res, next) => {
  let products = data.products;

  data.products = products.filter((val) => {
    if (val.id === parseInt(req.params.id)) return false;
    else return true;
  });

  res.send(data.products);
});

app.use('*', notFound);
app.use(serverError);

module.exports = {
  server: app,
  start: startServer,
};
