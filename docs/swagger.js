'use strict';

const generateSwagger = (app) => {

  // const express = require('express');
  // const app = express();
  const expressSwagger = require('express-swagger-generator')(app);

  let options = {
    swaggerDefinition: {
      info: {
        description: 'Access CRUD operations for products and categories',
        title: 'My API Server',
        version: '1.0.0',
      },
      host: 'localhost:3000',
      basePath: '/',
      produces: ['application/json', 'text/html'],
      schemes: ['http'],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: '',
        },
      },
    },
    basedir: __dirname, //app absolute path
    files: ['../lib/server.js'], //Path to the API handlers
  };

  expressSwagger(options);
};

module.exports = generateSwagger;
// let swaggerPort = process.env.SWAGGER_PORT || 3001;
// app.listen(swaggerPort);