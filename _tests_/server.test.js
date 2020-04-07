'use strict';

const app = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(app.server);

describe('categories routes work', () => {
  it('can get categories', async () => {
    let response = await mockRequest.get('/categories');

    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify([
        {
          id: 1,
          name: 'apple',
          count: 20,
        },
        {
          id: 2,
          name: 'pear',
          count: 14,
        },
        {
          name: 'orange',
          count: 9,
          id: 3,
        },
      ]),
    );

    expect(response.status).toBe(200);
  });

  it('can update a category', async () => {
    let newCategoryData = {
      name: 'apple',
      count: 25,
    };

    let response = await mockRequest.put('/fruits/1').send(newCategoryData);

    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify({ name: 'apple', count: 25, id: 1 }),
    );

    expect(response.status).toBe(200);
  });
});

describe('middleware works', () => {
  it("gives 404 error when accessing route that doesn't exist", async () => {
    let response = await mockRequest.post('/error');
    expect(response.status).toBe(404);
  });
});