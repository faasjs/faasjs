// eslint-disable-next-line @typescript-eslint/no-var-requires
const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello'
})

app.listen(3000)
