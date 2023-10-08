import { IMiddleware } from "koa-router"
import { isInitialized } from "../services/currencyService"

const handler: IMiddleware = ctx => {
  {
    const isReady = isInitialized()
    if (isReady) {
      ctx.status = 200
      ctx.body = "OK"
    } else {
      ctx.status = 503
      ctx.body = "Service Unavailable"
    }
  }
}

export default handler
