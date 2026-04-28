import { afterAll, beforeEach } from 'vitest'

import { setupTypedPgVitest } from '../setup-helper'

setupTypedPgVitest({ afterAll, beforeEach, projectRoot: process.cwd() })
