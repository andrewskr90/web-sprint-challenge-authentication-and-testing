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
