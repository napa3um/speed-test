import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { strictEqual, ok } from 'node:assert'
import test from 'node:test'

const HOST = '127.0.0.1'

function createMockServer(port, fixture) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const chunks = []
      const size = 8192
      for (let i = 0; i < fixture.length; i += size) {
        chunks.push(Buffer.from(fixture.slice(i, i + size), 'utf-8'))
      }
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(fixture),
      })
      for (const chunk of chunks) {
        res.write(chunk)
      }
      res.end()
    })
    server.listen(port, HOST, () => resolve(server))
    server.on('error', reject)
  })
}

async function killProcess(proc, timeout = 3000) {
  proc.kill('SIGTERM')
  return new Promise((resolve) => {
    proc.on('close', () => resolve())
    proc.on('error', () => resolve())
    setTimeout(() => {
      proc.kill('SIGKILL')
      proc.on('close', () => resolve())
      setTimeout(resolve, 1000)
    }, timeout)
  })
}

function spawnCli(args, cwd) {
  return new Promise((resolve) => {
    const proc = spawn(
      'node',
      args,
      { stdio: ['ignore', 'pipe', 'pipe'], cwd }
    )

    const stdout = []
    const stderr = []

    proc.stdout.on('data', (chunk) => stdout.push(chunk))
    proc.stderr.on('data', (chunk) => stderr.push(chunk))

    proc.on('close', (code) => {
      resolve({ code, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) })
    })

    proc.on('error', (err) => {
      resolve({ code: 1, stdout: Buffer.from(err.message), stderr: Buffer.from(err.message) })
    })
  })
}

test('e2e: CLI output with mock server', async () => {
  const PORT = 19001
  const fixture = 'X'.repeat(100000) // 100 KB
  const server = await createMockServer(PORT, fixture)
  const cwd = join(import.meta.dirname, '../..') // project root

  const result = await spawnCli(
    ['bin/speed-test-cli.js', `http://${HOST}:${PORT}/`, '-n', '2'],
    cwd
  )

  const stdout = result.stdout.toString('utf-8')
  const stderr = result.stderr.toString('utf-8')

  server.close()

  strictEqual(result.code, 0, `Exit code should be 0, got ${result.code}`)
  strictEqual(stderr, '', `Stderr should be empty, got: "${stderr}"`)
  ok(stdout.includes('Speed test:'), 'Should contain "Speed test:"')
  ok(stdout.includes(`http://${HOST}:${PORT}`), 'Should contain test URL')
  ok(stdout.includes('Number of requests: 2'), 'Should show count')
  ok(stdout.includes('#1:'), 'Should show download #1')
  ok(stdout.includes('#2:'), 'Should show download #2')
  ok(stdout.includes('─'.repeat(50)), 'Should have separator')
  ok(/Average:\s+\d+,\d+\s+(kB|MB|GB|TB)\/s/.test(stdout), `Average line: ${stdout.match(/Average:.*/)?.[0]}`)
  ok(stdout.includes('Done: 2 / 2 successful downloads'), `Done line: ${stdout.match(/Done:.*/)?.[0]}`)
})

test('e2e: CLI rejects bad URL', async () => {
  const cwd = join(import.meta.dirname, '../..') // project root
  const result = await spawnCli(
    ['bin/speed-test-cli.js', 'not-a-valid-url'],
    cwd
  )

  strictEqual(result.code, 1, 'Should exit with code 1')
  const output = result.stdout.toString('utf-8')
  const error = result.stderr.toString('utf-8')
  ok(output.includes('Bad url') || error.includes('Bad url'), 'Should print "Bad url" error')
})

test('e2e: CLI rejects count > 100', async () => {
  const PORT = 19002
  const server = await createMockServer(PORT, 'A')
  const cwd = join(import.meta.dirname, '../..') // project root

  const result = await spawnCli(
    ['bin/speed-test-cli.js', `http://${HOST}:${PORT}/`, '-n', '101'],
    cwd
  )

  server.close()

  strictEqual(result.code, 1, 'Should exit with code 1')
  const output = result.stdout.toString('utf-8')
  const error = result.stderr.toString('utf-8')
  ok(
    output.includes('Count must be between 1 and 100') ||
    error.includes('Count must be between 1 and 100'),
    'Should print count validation error'
  )
})

test('e2e: CLI shows help', async () => {
  const cwd = join(import.meta.dirname, '../..') // project root
  const result = await spawnCli(
    ['bin/speed-test-cli.js', '--help'],
    cwd
  )

  strictEqual(result.code, 0, 'Help should exit with code 0')
  const stdout = result.stdout.toString('utf-8')
  ok(stdout.includes('speed-test'), 'Should mention speed-test')
  ok(stdout.includes('Usage:'), 'Should show Usage')
  ok(stdout.includes('Options:'), 'Should show Options')
})
