import Koa from "koa"
import KoaBody from "koa-body"
import KoaCors from "koa-cors"
import { createServer } from "http"
import { WebSocketServer } from "ws"
import { config } from "./config"
import { router } from "./src/router/index"
import * as eventService from "./src/services/eventService"
import * as currencyService from "./src/services/currencyService"

const app = new Koa()
const server = createServer(app.callback())
const wss = new WebSocketServer({ server })

app.use(KoaCors())
app.use(KoaBody())
app.use(router.routes())
app.use(router.allowedMethods())

wss.on("connection", ws => {
  const syncHook = (data: any) => ws.send(JSON.stringify(data))
  eventService.registerSyncHook(syncHook)
  ws.on("close", () => eventService.unregisterSyncHook(syncHook))
  ws.on("error", console.error)
})

server.listen(config.http.port, () => {
  console.log(`HTTP server started on port ${config.http.port}`)
})

currencyService.initialize()
