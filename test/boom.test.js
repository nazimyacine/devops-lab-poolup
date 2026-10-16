/**
 * Integration test for GET /boom.
 * Ensures global error handler shapes the response.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'
import { resolveBoomStatus } from '../src/routes/auto/boom.route.js'

describe('GET /boom', () => {
  it('returns 500 with error payload', async () => {
    const res = await request(app).get('/boom')
    expect(res.status).toBe(500)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({ error: true, message: 'Boom!' })
  })

  it('simulates another server error with ?status=503', async () => {
    const res = await request(app).get('/boom?status=503')
    expect(res.status).toBe(503)
    expect(res.body.error).toBe(true)
  })

  it('falls back to 500 when ?status is not a 5xx code', async () => {
    const res = await request(app).get('/boom?status=200')
    expect(res.status).toBe(500)
  })
})

describe('resolveBoomStatus', () => {
  it.each([
    [undefined, 500],
    ['503', 503],
    ['599', 599],
    ['404', 500],
    ['600', 500],
    ['abc', 500],
    ['502.5', 500]
  ])('maps %s to %i', (raw, expected) => {
    expect(resolveBoomStatus(raw)).toBe(expected)
  })
})
