import { inject } from 'vitest'

import { PG_VITEST_DATABASE_URLS_KEY, requirePgVitestDatabaseUrl } from './plugin-context'

const databaseUrls = inject(PG_VITEST_DATABASE_URLS_KEY)

process.env.DATABASE_URL = requirePgVitestDatabaseUrl(databaseUrls)
