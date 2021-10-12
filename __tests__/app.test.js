const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

describe('CTlab16auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const human = { 
    email: 'mili@fam.com', 
    password: 'password', 
    roleTitle: 'USER'  };

  afterAll(() => {
    pool.end();
  });

  it('signs up a user with proper roll via POST', async () => {
    const res = await request(app)
      .post('/api/auth/signup').send(human);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'mili@fam.com'
    });
  });

  it('should give a 401 if user exists', async () => {
    await UserService.signUp(human); 
    const res = await request(app)
      .post('/api/auth/signup').send(human);

    expect(res.status).toEqual(401);
  });

  it('logs in a user with a POST', async () => {
    await UserService.signUp(human);

    const res = await request(app)
      .post('/api/auth/login')
      .send(human);
    
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'mili@fam.com',
      roleTitle: 'USER'
    });
  });

  it('should give a 400 if credentials are incorrect', async () => {
    await UserService.signUp(human);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'milli@fam.com', password: 'password' });
    expect(res.status).toEqual(400);
  });

  it('should return currently loggin in user', async () => {
    await UserService.signUp(human);
    const agent = request.agent(app);
    await agent.post('/api/auth/login')
      .send(human);

    const res = await agent
      .get('/api/auth/me');
    expect(res.body).toEqual({ id: expect.any(String), email: 'mili@fam.com', roleTitle: 'USER', iat: expect.any(Number), exp: expect.any(Number) });
  });

});
