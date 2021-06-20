/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default function FaasModule (this: {
  options: {
    dev: boolean
    server: {
      host: string
      port: number
      https: boolean
    }
  }
  addPlugin: (options: {
    src: string
    options: any
    mode: string
  }) => any
  addServerMiddleware: (options: {
    path: string
    handler: any
  }) => any
}, options: {
  baseUrl: string
  root: string
}): void {
  this.addPlugin({
    src: __dirname + '/plugins/browser.js',
    options,
    mode: 'client'
  });

  this.addPlugin({
    src: __dirname + '/plugins/server.js',
    options,
    mode: 'server'
  });

  if (this.options.dev) {
    const Server = require('@faasjs/server').Server;
    const server = new Server(options.root);

    if (!process.env.FaasEnv && process.env.NODE_ENV === 'development') process.env.FaasEnv = 'development'; 

    process.env.FaasMode = 'local';
    process.env.FaasLocal = `http${this.options.server.https ? 's' : ''}://${this.options.server.host}:${this.options.server.port}/_faas`;

    console.log(`[faas] Mode: ${process.env.FaasMode} Env: ${process.env.FaasEnv} Local: ${process.env.FaasLocal}`);

    this.addServerMiddleware({
      path: '/_faas',
      async handler (req: any, res: any) {
        await server.processRequest(req, res);
      }
    });
  }
}
