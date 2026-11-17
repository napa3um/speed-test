#!/usr/bin/env node

/**
 * CLI entry point for speed-test.
 * Parses command-line arguments and invokes the main module.
 * @module bin/speed-test-cli
 */

import { parseArgs } from 'node:util'
import runSpeedTest from '../src/speed-test.js'

/**
 * Parse command-line arguments and extract url and count.
 * @returns {{ values: { help?: boolean, count: string }, positionals: string[] }}
 */
const { values: { count, help }, positionals: [url] } = (() => {
  try {
    return parseArgs({
      args: process.argv.slice(2),
      options: {
        help: {
          type: 'boolean',
          short: 'h',
        },
        count: {
          type: 'string',
          short: 'n',
          default: '10',
        },
      },
      allowPositionals: true,
    })
  }
  catch (err) {
    console.error(err.message)
    process.exit(1)
  }
})()

if (help) {
  console.log(`
speed-test - streaming download speed test

Usage:
  speed-test <url> [-n <count>]

Arguments:
  <url>         URL of the file to download

Options:
  -n, --count   Number of requests (default: 10)
  -h, --help    Show this help

Example:
  speed-test https://example.com/file.bin -n 5
`)
  process.exit(0)
}

try {
  new URL(url)
} catch (err) {
  console.error('Bad url: %s', url)
  process.exit(1)
}

const intCount = parseInt(count, 10)

if (isNaN(intCount) || intCount < 1 || intCount > 100) {
  console.error('Count must be between 1 and 100')
  process.exit(1)
}

runSpeedTest(url, count)
