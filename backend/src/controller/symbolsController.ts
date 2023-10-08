import { IMiddleware } from "koa-router"
import { getSymbols } from "../services/currencyService"

const handler: IMiddleware = ctx => {
  const symbols = getSymbols()

  switch (symbols) {
    case "E_MEMORY_NOT_INITIALIZED":
      ctx.status = 503
      ctx.body = "Service Unavailable"
      break

    default:
      ctx.status = 200
      ctx.body = symbols.map(symbol => ({
        id: symbol.id,
        label: symbol.label,
      }))
      break
  }
}

export default handler
