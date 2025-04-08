import { Server } from '@faasjs/server'

new Server(process.env.FaasRoot as string, {
  port: Number(process.env.FaasPort as string),
}).listen()
