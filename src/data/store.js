/**
 * In-memory data store for the PoolUp API.
 * No database yet: data lives in these arrays and is reset when the
 * server restarts. Every route imports the same arrays, so a booking
 * created through /api/bookings is visible in /api/metrics.
 */

export const users = [
  { id: 1, name: 'Alice Martin', email: 'alice.martin@poolup.dev', role: 'driver' },
  { id: 2, name: 'Karim Benali', email: 'karim.benali@poolup.dev', role: 'passenger' },
  { id: 3, name: 'Julie Durand', email: 'julie.durand@poolup.dev', role: 'passenger' }
]

export const rides = [
  { id: 1, driverId: 1, from: 'Paris', to: 'Lyon', date: '2026-11-20', seats: 3, price: 25 },
  { id: 2, driverId: 1, from: 'La Défense', to: 'Lille', date: '2026-11-22', seats: 2, price: 18 }
]

export const bookings = [
  { id: 1, rideId: 1, passengerId: 2, seats: 1 }
]

/**
 * Next free id for a list: highest existing id + 1.
 * Safer than `list.length + 1`, which repeats an id once an item is removed.
 */
export function nextId (list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
