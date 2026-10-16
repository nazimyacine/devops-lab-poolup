/**
 * Unit tests for src/utils/status.js.
 * Covers all branches for good branch coverage.
 */
import { describe, it, expect } from 'vitest'
import { formatStatus } from '../../src/utils/status.js'

describe('formatStatus', () => {
  it('throws on negative', () => {
    expect(() => formatStatus(-1)).toThrow('invalid uptime')
  })
  it('warming-up under 60s', () => {
    expect(formatStatus(10)).toBe('warming-up')
  })
  it('healthy under 1h', () => {
    expect(formatStatus(3599)).toBe('healthy')
  })
  it('steady at or after 1h', () => {
    expect(formatStatus(3600)).toBe('steady')
  })

  it.each([
    [0, 'warming-up'],
    [59, 'warming-up'],
    [60, 'healthy'],
    [3600, 'steady'],
    [86400, 'steady']
  ])('maps %i s to %s (boundaries)', (uptime, label) => {
    expect(formatStatus(uptime)).toBe(label)
  })

  it('throws a RangeError on negative uptime', () => {
    expect(() => formatStatus(-0.5)).toThrow(RangeError)
  })

  it.each([NaN, Infinity, '120', null, undefined])('throws a TypeError on %s', (value) => {
    expect(() => formatStatus(value)).toThrow(TypeError)
  })
})
