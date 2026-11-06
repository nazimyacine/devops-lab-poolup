/**
 * /api/rides → carpool trips offered by drivers.
 *  - GET  /api/rides             list rides, optional filters ?from=Paris&to=Lyon
 *  - GET  /api/rides/:id         one ride, 404 if unknown
 *  - POST /api/rides             publish a ride { driverId, from, to, date, seats, price }
 */
import { Router } from 'express'
import { rides, users, nextId } from '../../data/store.js'

const router = Router()

// Case-insensitive comparison so "paris" matches "Paris"
const sameCity = (a, b) => a.toLowerCase() === b.toLowerCase()

router.get('/api/rides', (req, res) => {
  const { from, to } = req.query
  let result = rides
  if (from) result = result.filter(r => sameCity(r.from, from))
  if (to) result = result.filter(r => sameCity(r.to, to))
  res.status(200).json(result)
})

router.get('/api/rides/:id', (req, res) => {
  const ride = rides.find(r => r.id === Number(req.params.id))
  if (!ride) return res.status(404).json({ error: 'Ride not found' })
  res.status(200).json(ride)
})

router.post('/api/rides', (req, res) => {
  const { driverId, from, to, date, seats, price } = req.body ?? {}

  if (!driverId || !from || !to || !date || seats === undefined || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields: driverId, from, to, date, seats, price' })
  }
  if (!Number.isInteger(seats) || seats < 1) {
    return res.status(400).json({ error: 'Seats must be a whole number of at least 1' })
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a positive number' })
  }

  const driver = users.find(u => u.id === driverId)
  if (!driver || driver.role !== 'driver') {
    return res.status(400).json({ error: 'driverId must belong to a user with the driver role' })
  }

  const newRide = { id: nextId(rides), driverId, from, to, date, seats, price }
  rides.push(newRide)
  res.status(201).json(newRide)
})

export default router
