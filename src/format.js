/**
 * Format bytes to a human-readable string (B, kB, MB, GB, TB).
 * Uses SI decimal prefixes (1 kB = 1000 bytes).
 * @param {number} bytes - Number of bytes.
 * @returns {string} Formatted string, e.g. "1,5 kB".
 */
export function formatBytes(bytes) {
  let value, unit

  if (bytes < 1000) {
    value = bytes
    unit = 'B'
  } else if (bytes < 1_000_000) {
    value = bytes / 1_000
    unit = 'kB'
  } else if (bytes < 1_000_000_000) {
    value = bytes / 1_000_000
    unit = 'MB'
  } else if (bytes < 1_000_000_000_000) {
    value = bytes / 1_000_000_000
    unit = 'GB'
  } else {
    value = bytes / 1_000_000_000_000
    unit = 'TB'
  }

  const formattedValue = value % 1 === 0
    ? String(value)
    : value.toFixed(1).replace('.', ',')

  return `${formattedValue} ${unit}`
}

/**
 * Format milliseconds to a human-readable time string.
 * Supports days, hours, minutes, seconds with milliseconds precision.
 * @param {number} milliseconds - Duration in milliseconds.
 * @returns {string} Formatted string, e.g. "1h 01m 05.000s".
 */
export function formatMilliseconds(milliseconds) {
  const date = new Date(milliseconds)

  const days = Math.floor(milliseconds / 86400000)
  const daysStr = `${days > 0 ? `${days}d ` : ''}`

  const hours = date.getUTCHours()
  const hoursStr = `${hours > 0 || days > 0 ? `${hours}h ` : ''}`

  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const minutesStr = `${minutes > 0 || hours > 0 || days > 0 ? `${minutes}m ` : ''}`

  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  const ms = Math.floor(milliseconds) % 1000
  const secondsStr = `${seconds}.${String(ms).padStart(3, '0')}s`

  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`
}
