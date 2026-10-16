/**
 * Utility designed to create branch coverage.
 * Maps uptime (seconds) to a label:
 *   0 to 59 s      → 'warming-up'
 *   60 to 3599 s   → 'healthy'
 *   3600 s or more → 'steady'
 * Une valeur qui n'est pas un nombre fini (NaN, Infinity, texte) ou qui est
 * négative est refusée : elle signale une erreur en amont, pas un état réel.
 */
export function formatStatus (uptimeSec) {
  if (typeof uptimeSec !== 'number' || !Number.isFinite(uptimeSec)) {
    throw new TypeError('invalid uptime')
  }
  if (uptimeSec < 0) throw new RangeError('invalid uptime')
  if (uptimeSec < 60) return 'warming-up'
  if (uptimeSec < 3600) return 'healthy'
  return 'steady'
}
