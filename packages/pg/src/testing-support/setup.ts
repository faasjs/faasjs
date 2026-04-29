import { inject } from 'vitest'

import {
  PG_VITEST_DATABASE_URL_ENV_NAME,
  PG_VITEST_DATABASE_URLS_KEY,
  requirePgVitestDatabaseUrl,
} from '../../../pg-dev/src/plugin-context'

const databaseUrls = inject(PG_VITEST_DATABASE_URLS_KEY)

process.env[PG_VITEST_DATABASE_URL_ENV_NAME] = requirePgVitestDatabaseUrl(databaseUrls)
