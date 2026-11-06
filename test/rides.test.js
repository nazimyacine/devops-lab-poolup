/**
 * Integration tests for /api/rides.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

const validRide = { driverId: 1, from: 'Paris', to: 'Nantes', date: '2026-12-01', seats: 3, price: 30 }

describe('Rides API', () => {
  it('GET /api/rides returns an array of rides', async () => {
    const res = await request(app).get('/api/rides')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/rides?from=paris&to=lyon filters by city, ignoring case', async () => {
    const res = await request(app).get('/api/rides?from=paris&to=lyon')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    for (const ride of res.body) {
      expect(ride.from).toBe('Paris')
      expect(ride.to).toBe('Lyon')
    }
  })

  it('GET /api/rides/:id returns one ride, 404 when unknown', async () => {
    expect((await request(app).get('/api/rides/1')).status).toBe(200)
    expect((await request(app).get('/api/rides/999')).status).toBe(404)
  })

  it('POST /api/rides publishes a ride', async () => {
    const res = await request(app).post('/api/rides').send(validRide)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.to).toBe('Nantes')
  })

  it('POST /api/rides returns 400 when a field is missing', async () => {
    const res = await request(app).post('/api/rides').send({ from: 'Paris' })
    expect(res.status).toBe(400)
  })

  it.each([
    ['seats is 0', { seats: 0 }],
    ['seats is not a whole number', { seats: 1.5 }],
    ['price is negative', { price: -5 }],
    ['the driver does not exist', { driverId: 999 }],
    ['the user is a passenger', { driverId: 2 }]
  ])('POST /api/rides returns 400 when %s', async (_label, override) => {
    const res = await request(app).post('/api/rides').send({ ...validRide, ...override })
    expect(res.status).toBe(400)
  })
})
