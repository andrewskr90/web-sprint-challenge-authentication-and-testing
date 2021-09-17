const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.down()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('[POST] /auth/register', () => {
  test('Registers user to users table', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'scott', password: '1234' })
    expect(res.body.username).toBe('scott')
  })
  test('Sends error when username already exists', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'scott', password: '1234' })
      let res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'scott', password: '1234' })
      expect(res.body.message).toBe('username taken')
  })
})

describe('[POST] /auth/login', () => {
  test('Registered user able to login', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'scott', password: '1234' })
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'scott', password: '1234' })
    expect(res.body.message).toBe('welcome, scott')
  })
  test('Unregistered user unable to login', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'scott', password: '1234' })
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'lisa', password: '1234' })
    expect(res.body.message).toBe('invalid credentials')
  })
  test('Responds with token', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'scott', password: '1234' })
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'scott', password: '1234' })
    expect(res.body.token).toBeTruthy
  })
})

describe('[GET] /api/jokes', () => {
  test('User without token cannot access', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'scott', password: '1234' })
    await request(server)
      .post('/api/auth/login')
      .send({ username: 'scott', password: '1234' })
    let res = await request(server)
      .post('/api/jokes')
    expect(res.body.message).toBe('token required')
  })
  test('Reponds with error 401 without token', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'scott', password: '1234' })
      await request(server)
        .post('/api/auth/login')
        .send({ username: 'scott', password: '1234' })
      let res = await request(server)
        .post('/api/jokes')
      expect(res.body.errorStatus).toBe(401)
  })
})
