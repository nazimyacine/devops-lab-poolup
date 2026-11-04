/**
 * /api/users → PoolUp accounts (drivers and passengers).
 *  - GET  /api/users       list all users
 *  - GET  /api/users/:id   one user, 404 if unknown
 *  - POST /api/users       create a user { name, email, role }
 */
import { Router } from 'express'
import { users, nextId } from '../../data/store.js'

const router = Router()
const ROLES = ['driver', 'passenger']

router.get('/api/users', (_req, res) => {
  res.status(200).json(users)
})

router.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id))
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.status(200).json(user)
})

router.post('/api/users', (req, res) => {
  const { name, email, role } = req.body ?? {}

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields: name, email, role' })
  }
  if (!ROLES.includes(role)) {
    return res.status(400).json({ error: 'Role must be driver or passenger' })
  }
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already used' })
  }

  const newUser = { id: nextId(users), name, email, role }
  users.push(newUser)
  res.status(201).json(newUser)
})

export default router
