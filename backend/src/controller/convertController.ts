import { IMiddleware } from "koa-router"
import { config } from "../../config"
import { convert } from "../services/currencyService"
import * as currencyHelper from "../helpers/currencyHelper"

const handler: IMiddleware = async ctx => {
  const _currencyFrom = ctx.request.body?.currencyFrom
  const _currencyTo = ctx.request.body?.currencyTo
  const _amount = ctx.request.body?.amount

  if (!currencyHelper.check(_currencyFrom)) {
    ctx.status = 400
    ctx.body = "Bad Request"
    return
  }

  if (!currencyHelper.check(_currencyTo)) {
    ctx.status = 400
    ctx.body = "Bad Request"
    return
  }

  if (currencyHelper.normalize(_currencyFrom) === currencyHelper.normalize(_currencyTo)) {
    ctx.status = 400
    ctx.body = "Bad Request"
    return
  }

  if (typeof _amount !== "number" || _amount <= 0 || _amount > config.currencyAmountAllowed) {
    ctx.status = 400
    ctx.body = "Bad Request"
    return
  }

  try {
    const convertResponse = await convert(_currencyFrom, _currencyTo, _amount)
    switch (convertResponse) {
      case "E_MEMORY_NOT_INITIALIZED":
        ctx.status = 503
        ctx.body = "Service Unavailable"
        break

      case "E_CONVERSION_NOT_FOUND":
        ctx.status = 400
        ctx.body = "Conversion not found"
        break

      default:
        ctx.status = 200
        ctx.body = {
          amountConverted: convertResponse.amountConverted,
          conversionRate: convertResponse.conversionRate,
        }
        break
    }
  } catch (e) {
    ctx.status = 500
    ctx.body = "Internal Error"
  }
}

export default handler
