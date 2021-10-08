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

  it('should give a 401 if user exists', async () => {
    await UserService.signUp({ email: 'mili@fam.com', password: 'password' }); 
    const res = await request(app)
      .post('/api/auth/signup').send({ email: 'mili@fam.com', password: 'password' });

    expect(res.status).toEqual(401);
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

  it('should give a 400 if credentials are incorrect', async () => {
    await UserService.signUp({ email: 'mili@fam.com', password: 'password' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'milli@fam.com', password: 'password' });
    expect(res.status).toEqual(400);
  });
  // GET route to /me that responds with the currently logged in User. (2 points)
  // DO NOT RETURN THE USER'S passwordHash! If you do... MINUS 5 POINTS!!!! (Seriously)
  // it('should return currently loggin in user', async () => {
  //   const res = await request(app)
  //     .get('/api/auth/me');
  //   expect(res.body).toEqual({ id: expect.any(String), email: 'mili@fam.com' });
  // });

});
