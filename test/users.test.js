/**
 * Integration tests for /api/users.
 * Each test file gets a fresh copy of the in-memory store (Vitest isolates
 * files), so the users created here do not leak into other test files.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Users API', () => {
  it('GET /api/users returns an array of users', async () => {
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body[0]).toHaveProperty('email')
  })

  it('GET /api/users/:id returns one user', async () => {
    const res = await request(app).get('/api/users/1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
  })

  it('GET /api/users/:id returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/users/999')
    expect(res.status).toBe(404)
  })

  it('POST /api/users creates a user with a new id', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Nora Haddad', email: 'nora.haddad@poolup.dev', role: 'passenger' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Nora Haddad')
  })

  it('POST /api/users returns 400 when a field is missing', async () => {
    const res = await request(app).post('/api/users').send({ name: 'No Email' })
    expect(res.status).toBe(400)
  })

  it('POST /api/users returns 400 for an unknown role', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Bob', email: 'bob@poolup.dev', role: 'admin' })
    expect(res.status).toBe(400)
  })

  it('POST /api/users returns 409 when the email is already used', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice Bis', email: 'alice.martin@poolup.dev', role: 'driver' })
    expect(res.status).toBe(409)
  })

  it('POST with malformed JSON is answered by the error handler with 400', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send('{"name": ')
    expect(res.status).toBe(400)
    expect(res.body.error).toBe(true)
  })
})
