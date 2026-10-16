/**
 * GET /version → { version: "<package.json version>" }
 * La version est lue via getPackageInfo() : package.json n'est lu qu'à
 * un seul endroit dans le projet, /version et /info ne peuvent pas diverger.
 */
import { Router } from 'express'
import { getPackageInfo } from '../../utils/appInfo.js'

const router = Router()

router.get('/version', (_req, res) => {
  const { version } = getPackageInfo()
  res.status(200).json({ version })
})

export default router
