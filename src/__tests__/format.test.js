import { describe, it } from 'node:test'
import { strictEqual } from 'node:assert'
import { formatBytes, formatMilliseconds } from '../format.js'

describe('formatBytes', () => {
  it('returns "0 B" for zero bytes', () => {
    strictEqual(formatBytes(0), '0 B')
  })

  it('returns "100 B" for 100 bytes', () => {
    strictEqual(formatBytes(100), '100 B')
  })

  it('returns "1 kB" for 1000 bytes', () => {
    strictEqual(formatBytes(1000), '1 kB')
  })

  it('returns "1,5 kB" for 1536 bytes', () => {
    strictEqual(formatBytes(1536), '1,5 kB')
  })

  it('returns "1 MB" for 1 000 000 bytes (SI megabyte)', () => {
    strictEqual(formatBytes(1000000), '1 MB')
  })

  it('returns "5,4 GB" for 5 GiB (binary gigabytes ≈ 5,37 GB decimal)', () => {
    strictEqual(formatBytes(5 * 1073741824), '5,4 GB')
  })
})

describe('formatMilliseconds', () => {
  it('formats 1500 ms as seconds', () => {
    strictEqual(formatMilliseconds(1500), '01.500s')
  })

  it('formats 1234 ms with decimals', () => {
    strictEqual(formatMilliseconds(1234), '01.234s')
  })

  it('includes minutes for 65 000 ms', () => {
    strictEqual(formatMilliseconds(65000), '01m 05.000s')
  })

  it('includes hours for 3 600 000 ms', () => {
    strictEqual(formatMilliseconds(3600000), '1h 00m 00.000s')
  })

  it('includes days, hours, minutes, seconds for large values', () => {
    strictEqual(formatMilliseconds(90065000), '1d 1h 01m 05.000s')
  })
})
