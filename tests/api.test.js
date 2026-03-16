const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');

test('sign up, sign in, and create forum post flow', async () => {
  const email = `test-${Date.now()}@educonnect.local`;

  const signUp = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test User', email, password: 'secret123' });

  assert.equal(signUp.status, 201);
  assert.ok(signUp.body.token);

  const signIn = await request(app)
    .post('/api/auth/signin')
    .send({ email, password: 'secret123' });

  assert.equal(signIn.status, 200);
  assert.ok(signIn.body.token);

  const token = signIn.body.token;

  const createPost = await request(app)
    .post('/api/forum')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'My first post', description: 'This is a valid forum post description.' });

  assert.equal(createPost.status, 201);

  const listPosts = await request(app)
    .get('/api/forum/all')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(listPosts.status, 200);
  assert.ok(Array.isArray(listPosts.body));
});
