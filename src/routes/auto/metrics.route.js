/**
 * /api/metrics → PoolUp statistics, computed from the shared data store.
 *  - GET /api/metrics   counts of users, rides and bookings, seat occupancy, uptime
 * Read-only: there is no POST, metrics are always derived from the other routes' data.
 */
import { Router } from 'express'
import { users, rides, bookings } from '../../data/store.js'

const router = Router()

/**
 * Builds the metrics object from the data lists.
 * Kept separate from the route so it can be tested with any data, including empty lists.
 */
export function computeMetrics ({ users, rides, bookings }) {
  const seatsOffered = rides.reduce((sum, ride) => sum + ride.seats, 0)
  const seatsBooked = bookings.reduce((sum, booking) => sum + booking.seats, 0)

  return {
    users: {
      total: users.length,
      drivers: users.filter(u => u.role === 'driver').length,
      passengers: users.filter(u => u.role === 'passenger').length
    },
    rides: rides.length,
    bookings: bookings.length,
    seats: {
      offered: seatsOffered,
      booked: seatsBooked,
      available: seatsOffered - seatsBooked,
      // No ride yet → 0 % instead of a division by zero (NaN)
      occupancyRate: seatsOffered === 0 ? 0 : Math.round((seatsBooked / seatsOffered) * 100)
    }
  }
}

router.get('/api/metrics', (_req, res) => {
  res.status(200).json({
    ...computeMetrics({ users, rides, bookings }),
    uptime: Math.round(process.uptime())
  })
})

export default router
