/**
 * Small helpers used by /info.
 * Keeping logic here makes unit tests simple and fast.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function getPackageInfo () {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf-8')
  )
  return { name: pkg.name, version: pkg.version }
}

/**
 * uptime est arrondi à la seconde : une durée comme 2.058303308
 * n'apporte rien au client et rend la réponse moins lisible.
 */
export function getRuntimeInfo () {
  return { node: process.version, uptime: Math.round(process.uptime()) }
}
