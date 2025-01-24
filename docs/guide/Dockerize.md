# Dockerize FaasJS Application

This document describes how to dockerize a FaasJS application.

## File Structure

The file structure of a FaasJS application is as follows:

```plaintext
.
├── index.func.ts
├── faas.yaml
├── server.ts
├── Dockerfile
|── tsconfig.json
|── package.json
|── package-lock.json
```

- `*.func.ts`: The cloud function file. In FaasJS, all cloud function files must end with `.func.ts`.
- `faas.yaml`: The configuration file for FaasJS, which records the configuration items of cloud service providers and plugins.
- `server.ts`: The entry file of the FaasJS application.
- `Dockerfile`: The Dockerfile for building the FaasJS application.

## Server Entry (`server.ts`)

The following is an example of a `server.ts` file for a FaasJS application:

```typescript
import { Server } from '@faasjs/server'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

process.env.FaasRoot = `${__dirname}/`

const server = new Server(process.env.FaasRoot, {
  port: 3000
})

server.listen()
```

## Dockerfile

The following is an example of a `Dockerfile` for a FaasJS application:

```Dockerfile
FROM faasjs/node

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production && npm cache clean --force

COPY . .

ENV FaasEnv=production
ENV FaasMode=mono
ENV FaasLogMode=plain
ENV FaasLog=debug

EXPOSE 3000

CMD ["tsx", "server.ts"]
```
