import { inject } from 'vitest'

import {
  TYPED_PG_VITEST_DATABASE_URL_ENV_NAME,
  TYPED_PG_VITEST_DATABASE_URLS_KEY,
  requireTypedPgVitestDatabaseUrl,
} from '../../../pg-dev/src/plugin-context'

const databaseUrls = inject(TYPED_PG_VITEST_DATABASE_URLS_KEY)

process.env[TYPED_PG_VITEST_DATABASE_URL_ENV_NAME] = requireTypedPgVitestDatabaseUrl(databaseUrls)
