'use strict';

const app = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(app.server);

describe('categories routes work', () => {
  it('can get categories', async () => {
    let response = await mockRequest.get('/categories');
    console.log(response.body);

    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify([
        {
          id: 1,
          name: 'organic fruits',
          display_name: 'organic fruits',
          description: 'fruits from local organic farms'
        },
        {
          id: 2,
          name: 'imported fruits',
          display_name: 'imported fruits',
          description: 'fruits imported from oversea'
        },
        {
          id: 3,
          name: 'organic vegetables',
          display_name: 'organic vegetables',
          description: 'veggies from local organic farms'
        },
      ]),
    );

    expect(response.status).toBe(200);
  });

  it('can update a category', async () => {
    let newCategoryData = {
      id: 1,
      name: 'organic fruits',
      display_name: 'organic apples',
      description: 'apples from local organic farms'
    };

    let response = await mockRequest.put('/categories/1').send(newCategoryData);

    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify({ name: 'organic fruits', display_name: 'organic apples', description: 'apples from local organic farms', id: 1 }),
    );

    expect(response.status).toBe(200);
  });
});

describe('products routes work', () => {
  it('can get products', async () => {
    let response = await mockRequest.get('/products');
    console.log(response.body);

    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify([
        {
          id: 1,
          category: 'organic fruits',
          name: 'apples',
          display_name: 'organic apples',
          description: 'organic apples from Yakima'
        },
        {
          id: 2,
          category: 'organic fruits',
          name: 'bananas',
          display_name: 'organic bananas',
          description: 'organic bananas from California'
        },
        {
          id: 3,
          category: 'imported fruits',
          name: 'grapes',
          display_name: 'imported grapes',
          description: 'grapes from Chile'
        },
        {
          id: 4,
          category: 'imported fruits',
          name: 'mangos',
          display_name: 'imported mangos',
          description: 'mangos from Thailand'
        },
        {
          id: 5,
          category: 'organic vegetables',
          name: 'potatos',
          display_name: 'organic potatos',
          description: 'organic potatos from Idaho'
        },
        {
          id: 6,
          category: 'organic vegetables',
          name: 'carrots',
          display_name: 'organic carrots',
          description: 'organic carrots from Yakima'
        },
      ]),
    );

    expect(response.status).toBe(200);
  });

  it('can update a product', async () => {
    let newProductData = {
      id: 1,
      category: 'organic fruits',
      name: 'cherries',
      display_name: 'organic cherries',
      description: 'organic cherries from Yakima'
    };

    let response = await mockRequest.put('/products/1').send(newProductData);

    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify({ category: 'organic fruits', name: 'cherries', display_name: 'organic cherries', description: 'organic cherries from Yakima', id: 1 }),
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