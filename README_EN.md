# speed-test

A CLI utility for testing file download speeds using streamed (chunked) fetch.

[Русская версия](./README.md)

## Usage

```bash
# Run via npx (no installation needed)
npx napa3um/speed-test <url> [-n <count>]

# Or install globally
npm install napa3um/speed-test -g
speed-test <url> [-n <count>]

# Or install locally
npm install napa3um/speed-test
npm exec speed-test <url> [-n <count>]
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `<url>` | URL of the file to download | Yes |
| `-n, --count <number>` | Number of sequential requests (default: 10) | No |
| `-h, --help` | Show help | No |

## Examples

```bash
# 10 requests (default)
npx speed-test https://samplelib.com/png/sample-photo-3840x2160.png

# 5 requests
npx speed-test https://samplelib.com/png/sample-photo-3840x2160.png -n 5

# 20 requests
npx speed-test https://samplelib.com/png/sample-photo-3840x2160.png -count 20
```

## Output

```
─────────────────────────────────────────────────
#1:     16,8 MB / 01.234s
#2:     16,8 MB / 01.314s
#3:     16,8 MB / 01.386s
...
#10:    16,8 MB / 00.972s
─────────────────────────────────────────────────
Average: 13,3 MB/s
Done: 10 / 10 successful downloads
```

- **`16,8 MB`** — downloaded file size (B, kB, MB, GB) with 0.1 precision
- **`01.386s`** — elapsed time (days, hours, minutes, seconds with milliseconds)
- **`Average: 13,3 MB/s`** — average speed across all downloads (rounded unit per second)
- **`Done: 10 / 10 successful downloads`** — test results summary

## Requirements

- Node.js 18+ (for built-in `fetch`)
