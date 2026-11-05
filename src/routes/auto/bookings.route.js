/**
 * /api/bookings → a passenger reserves seats on a ride.
 *  - GET  /api/bookings    list bookings
 *  - POST /api/bookings    book seats { rideId, passengerId, seats }
 * Booking removes the seats from the ride, so a full ride cannot be overbooked.
 */
import { Router } from 'express'
import { bookings, rides, users, nextId } from '../../data/store.js'

const router = Router()

router.get('/api/bookings', (_req, res) => {
  res.status(200).json(bookings)
})

router.post('/api/bookings', (req, res) => {
  const { rideId, passengerId, seats = 1 } = req.body ?? {}

  if (!rideId || !passengerId) {
    return res.status(400).json({ error: 'Missing required fields: rideId, passengerId' })
  }
  if (!Number.isInteger(seats) || seats < 1) {
    return res.status(400).json({ error: 'Seats must be a whole number of at least 1' })
  }

  const ride = rides.find(r => r.id === rideId)
  if (!ride) return res.status(404).json({ error: 'Ride not found' })

  const passenger = users.find(u => u.id === passengerId)
  if (!passenger) return res.status(404).json({ error: 'Passenger not found' })
  if (passenger.id === ride.driverId) {
    return res.status(400).json({ error: 'A driver cannot book their own ride' })
  }

  if (seats > ride.seats) {
    return res.status(409).json({ error: `Only ${ride.seats} seat(s) left on this ride` })
  }

  ride.seats -= seats
  const newBooking = { id: nextId(bookings), rideId, passengerId, seats }
  bookings.push(newBooking)
  res.status(201).json(newBooking)
})

export default router
