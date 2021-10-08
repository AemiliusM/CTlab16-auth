const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

describe('CTlab16auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs up a user via POST', async () => {
    const res = await request(app)
      .post('/api/auth/signup').send({ email: 'mili@fam.com', password: 'password' });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'mili@fam.com'
    });
  });

  it('should give a 400 if user exists', async () => {
    await UserService.signUp({ email: 'mili@fam.com', password: 'password' }); 
    const res = await request(app)
      .post('/api/auth/signup').send({ email: 'mili@fam.com', password: 'password' });

    expect(res.status).toEqual(400);
  });

  it('logs in a user with a POST', async () => {
    await UserService.signUp({ email: 'mili@fam.com', password: 'password' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'mili@fam.com', password: 'password' });
    
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'mili@fam.com'
    });
  });

});
