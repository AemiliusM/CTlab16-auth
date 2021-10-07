const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('CTlab16auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs up a user via POST', async () => {
    const res = await request(app)
      .post('api/auth/signup').send({ email: 'mili@fam.com', password: 'password' });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'mili@fam.com'
    });
  });

});
