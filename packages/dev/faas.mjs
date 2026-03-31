#!/usr/bin/env node

import { main } from './dist/cli/index.mjs'

await main(process.argv).then((code) => {
  if (code !== 0) process.exit(code)
})
