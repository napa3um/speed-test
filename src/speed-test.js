import { formatBytes, formatMilliseconds } from './format.js'

/**
 * Builds a progress line prefix for a single download.
 * Returns a terminal string that moves to the start of the line, clears it,
 * and formats the download number, progress in bytes, and elapsed time.
 * @param {number} i - The download index (1-based).
 * @param {number} bytes - Number of bytes downloaded so far.
 * @param {number} elapsed - Milliseconds elapsed since this download started.
 * @returns {string} The formatted prefix, e.g. "\r\x1b[K#1:\t16,8 MB / 01.234s".
 */
function outputLinePrefix(i, bytes, elapsed) {
  return `\r\x1b[K#${i}:\t${formatBytes(bytes)} / ${formatMilliseconds(elapsed)}`
}

/**
 * Runs a speed test by downloading a URL sequentially multiple times.
 * Streams each response body chunk-by-chunk, showing progress.
 * @param {string} url - The URL to download and test.
 * @param {number} count - Number of sequential downloads.
 */
export default async function runSpeedTest(url, count) {
  console.log(`Speed test: ${url}`)
  console.log(`Number of requests: ${count}\n`)
  console.log('─'.repeat(50))

  const totalStartNow = performance.now()
  let totalErrors = 0
  let totalBytes = 0

  for (let i = 1; i <= count; i++) {
    const startNow = performance.now()
    let bytes = 0
    let lastUpdateTime = 0

    process.stdout.write(`${outputLinePrefix(i, 0, 0)} = ${formatBytes(0)}/s\r`)
    try {
      const response = await fetch(url, { method: 'GET' })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      if (!response.body) {
        throw new Error('Response body is null')
      }

      for await (const chunk of response.body) {
        bytes += chunk.byteLength
        totalBytes += chunk.byteLength

        const elapsed = performance.now() - startNow
        if (elapsed - lastUpdateTime >= 500) {
          lastUpdateTime = elapsed
          process.stdout.write(`${outputLinePrefix(i, bytes, elapsed)} = ${formatBytes(totalBytes / ((performance.now() - totalStartNow) / 1000))}/s\r`)
        }
      }
      process.stdout.write(`${outputLinePrefix(i, bytes, performance.now() - startNow)}\r`)
    } catch (error) {
      totalErrors++
      const elapsed = performance.now() - startNow
      process.stdout.write(`\r\x1b[K#${i}:\tERROR - ${error.message} (${formatMilliseconds(elapsed)})\r`)
    }

    process.stdout.write('\n')
  }

  const avgSpeed = totalBytes / ((performance.now() - totalStartNow) / 1000)

  console.log('─'.repeat(50))
  console.log(`Average: ${formatBytes(avgSpeed)}/s`)
  console.log(`Done: ${count - totalErrors} / ${count} successful downloads`)
}
