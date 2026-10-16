/**
 * GET /boom → triggers an error to exercise the global error handler.
 *
 * Par défaut l'erreur simulée est une 500. Le paramètre ?status=5xx permet
 * de simuler une autre panne serveur (ex. /boom?status=503) ; toute valeur
 * hors de 500-599 retombe sur 500, pour que /boom reste une erreur serveur.
 */
import { Router } from 'express'

const router = Router()

export function resolveBoomStatus (raw) {
  const status = Number(raw)
  return Number.isInteger(status) && status >= 500 && status <= 599 ? status : 500
}

router.get('/boom', (req, _res, next) => {
  const err = new Error('Boom!')
  err.status = resolveBoomStatus(req.query.status)
  next(err)
})

export default router
