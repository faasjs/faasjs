import { App } from '@faasjs/ant-design'
import { createRoot } from 'react-dom/client'

import UsersPage from './features/users'

createRoot(document.getElementById('root') as HTMLElement).render(
  <App
    browserRouterProps={false}
    configProviderProps={{
      theme: {
        token: {
          borderRadius: 16,
          colorPrimary: '#1677ff',
        },
      },
    }}
    faasConfigProviderProps={{
      faasClientOptions: {
        baseUrl: '/',
      },
    }}
  >
    <UsersPage />
  </App>,
)
