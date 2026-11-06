/**
 * Lab 5, part 2: JavaScript practice, adapted to PoolUp (carpooling).
 * Run it with: node js-practice.js
 * Each section matches one exercise of the lab (2.1 to 2.7, except 2.5,
 * which lives in practice/poolupData.js and practice/main.js).
 */

// ---------------------------------------------------------------------------
// 2.1 Variables and data types
// ---------------------------------------------------------------------------
console.log('\n--- 2.1 Variables and data types ---')

const platformName = 'PoolUp' // never changes, so const
let availableDrivers = 12 // changes over time, so let
let isOpen = true // is the booking service open?

function serviceMessage () {
  return isOpen
    ? `Welcome to ${platformName}! We have ${availableDrivers} drivers currently available.`
    : `${platformName} is closed for maintenance. Please come back later.`
}

console.log(serviceMessage())
availableDrivers -= 2
isOpen = false
console.log(serviceMessage())

// ---------------------------------------------------------------------------
// 2.2 Arrays and loops
// ---------------------------------------------------------------------------
console.log('\n--- 2.2 Arrays and loops ---')

const drivers = ['Alice Martin', 'Karim Benali', 'Julie Durand', 'Hugo Leroy', 'Sara Mendes']

// entries() gives [index, value]; index starts at 0, so we add 1 for display
for (const [index, name] of drivers.entries()) {
  console.log(`Driver #${index + 1}: ${name}`)
}

drivers.push('Yanis Ferhat')
console.log(`Drivers after push: ${drivers.length}`)

function findDriver (name) {
  return drivers.includes(name) ? 'Driver found' : 'Driver not found'
}
console.log('Hugo Leroy →', findDriver('Hugo Leroy'))
console.log('Bob Smith →', findDriver('Bob Smith'))

// ---------------------------------------------------------------------------
// 2.3 Objects and nested data
// ---------------------------------------------------------------------------
console.log('\n--- 2.3 Objects and nested data ---')

const ride = {
  from: 'Paris',
  to: 'Lyon',
  seats: 3,
  options: ['air conditioning', 'luggage'],
  driver: { name: 'Alice Martin', car: 'Peugeot 308' }
}

console.log('Driver name:', ride.driver.name)
console.log('Number of options:', ride.options.length)
console.log(`${ride.from} → ${ride.to} is driven by ${ride.driver.name} (${ride.driver.car}).`)

ride.options.push('pets allowed') // the object is const, but its content can change
console.log('Updated ride:', ride)

// ---------------------------------------------------------------------------
// 2.4 Functions and array filtering
// ---------------------------------------------------------------------------
console.log('\n--- 2.4 Functions and array filtering ---')

const rides = [
  { id: 1, from: 'Paris', to: 'Lyon', price: 25 },
  { id: 2, from: 'La Défense', to: 'Lille', price: 18 },
  { id: 3, from: 'Paris', to: 'Rennes', price: 32 }
]

// filter() keeps only the items for which the test returns true
function filterByMaxPrice (maxPrice) {
  return rides.filter(r => r.price <= maxPrice)
}

function addRide (from, to, price) {
  const newRide = { id: rides.length + 1, from, to, price }
  rides.push(newRide)
  return newRide
}

console.log('Rides at 25 € or less:', filterByMaxPrice(25))
addRide('Nanterre', 'Orléans', 15)
console.log('Updated list:', rides)

// ---------------------------------------------------------------------------
// 2.6 Error handling and validation
// ---------------------------------------------------------------------------
console.log('\n--- 2.6 Error handling and validation ---')

function createBooking (rideId, passenger, date) {
  if (!rideId || !passenger || !date) {
    throw new Error('Missing required fields')
  }
  return { rideId, passenger, date }
}

try {
  console.log(createBooking(1, 'Karim Benali', '2026-11-20'))
  console.log(createBooking(1)) // missing fields: jumps straight to catch
} catch (err) {
  console.error('Error:', err.message)
}

// ---------------------------------------------------------------------------
// 2.7 Asynchronous code
// ---------------------------------------------------------------------------
console.log('\n--- 2.7 Asynchronous code ---')

// A Promise stands for a result that arrives later (here after 1 second,
// to imitate a slow database). resolve() delivers that result.
function getPlatformStats () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: platformName, ridesToday: 42, uptime: 1234 })
    }, 1000)
  })
}

async function showStats () {
  console.log('Fetching platform stats...')
  const stats = await getPlatformStats() // waits here without blocking Node
  console.log('Stats loaded:', stats)
}

showStats()
