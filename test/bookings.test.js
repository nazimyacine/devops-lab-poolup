/**
 * Integration tests for /api/bookings.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'
import { rides } from '../src/data/store.js'

// Read seats straight from the store, so this test does not depend on /api/rides
const seatsLeft = (rideId) => rides.find(r => r.id === rideId).seats

describe('Bookings API', () => {
  it('GET /api/bookings returns an array of bookings', async () => {
    const res = await request(app).get('/api/bookings')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/bookings books one seat by default and updates the ride', async () => {
    const before = seatsLeft(2)
    const res = await request(app).post('/api/bookings').send({ rideId: 2, passengerId: 3 })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.seats).toBe(1)
    expect(seatsLeft(2)).toBe(before - 1)
  })

  it('POST /api/bookings returns 409 when not enough seats are left', async () => {
    const res = await request(app).post('/api/bookings').send({ rideId: 1, passengerId: 3, seats: 50 })
    expect(res.status).toBe(409)
  })

  it('POST /api/bookings returns 400 when a field is missing', async () => {
    const res = await request(app).post('/api/bookings').send({ rideId: 1 })
    expect(res.status).toBe(400)
  })

  it('POST /api/bookings returns 400 for an invalid number of seats', async () => {
    const res = await request(app).post('/api/bookings').send({ rideId: 1, passengerId: 3, seats: 0 })
    expect(res.status).toBe(400)
  })

  it('POST /api/bookings returns 404 for an unknown ride or passenger', async () => {
    expect((await request(app).post('/api/bookings').send({ rideId: 999, passengerId: 3 })).status).toBe(404)
    expect((await request(app).post('/api/bookings').send({ rideId: 1, passengerId: 999 })).status).toBe(404)
  })

  it('POST /api/bookings refuses a driver booking their own ride', async () => {
    const res = await request(app).post('/api/bookings').send({ rideId: 1, passengerId: 1 })
    expect(res.status).toBe(400)
  })
})
