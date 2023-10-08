import { IMiddleware } from "koa-router"
import * as currencyHelper from "../helpers/currencyHelper"
import { getConversionRates } from "../services/currencyService"

const handler: IMiddleware = ctx => {
  const _currencyFrom = ctx.request.query.currencyFrom

  if (!currencyHelper.check(_currencyFrom)) {
    ctx.status = 400
    ctx.body = "Bad Request"
    return
  }

  const rates = getConversionRates(_currencyFrom)
  switch (rates) {
    case "E_MEMORY_NOT_INITIALIZED":
      ctx.status = 503
      ctx.body = "Service Unavailable"
      break

    case "E_CURRENCY_NOT_FOUND":
      ctx.status = 400
      ctx.body = "Currency not found"
      break

    default:
      ctx.status = 200
      ctx.body = rates
      break
  }
}

export default handler
