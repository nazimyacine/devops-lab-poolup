/**
 * Tests for /api/metrics.
 * Integration tests go through Express with Supertest; unit tests call
 * computeMetrics() directly with hand-made data.
 */
import request from 'supertest'
import app from '../src/app.js'
import { computeMetrics } from '../src/routes/auto/metrics.route.js'
import { describe, it, expect } from 'vitest'

describe('GET /api/metrics', () => {
  it('returns 200 with the PoolUp statistics', async () => {
    const res = await request(app).get('/api/metrics')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toHaveProperty('users.total')
    expect(res.body).toHaveProperty('rides')
    expect(res.body).toHaveProperty('bookings')
    expect(res.body).toHaveProperty('seats.occupancyRate')
    expect(typeof res.body.uptime).toBe('number')
  })

  it('counts the users created through /api/users', async () => {
    const before = (await request(app).get('/api/metrics')).body.users.total
    await request(app)
      .post('/api/users')
      .send({ name: 'Metrics Tester', email: 'metrics.tester@poolup.dev', role: 'driver' })
    const after = (await request(app).get('/api/metrics')).body.users.total
    expect(after).toBe(before + 1)
  })
})

describe('computeMetrics', () => {
  it('computes counts and seat occupancy', () => {
    const metrics = computeMetrics({
      users: [{ role: 'driver' }, { role: 'passenger' }, { role: 'passenger' }],
      rides: [{ seats: 3 }, { seats: 1 }],
      bookings: [{ seats: 1 }]
    })
    expect(metrics.users).toEqual({ total: 3, drivers: 1, passengers: 2 })
    expect(metrics.rides).toBe(2)
    expect(metrics.bookings).toBe(1)
    expect(metrics.seats).toEqual({ offered: 4, booked: 1, available: 3, occupancyRate: 25 })
  })

  it('returns 0 % occupancy when there is no ride', () => {
    const metrics = computeMetrics({ users: [], rides: [], bookings: [] })
    expect(metrics.seats.occupancyRate).toBe(0)
    expect(metrics.seats.available).toBe(0)
  })
})
