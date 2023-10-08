import { IMiddleware } from "koa-router"
import * as currencyHelper from "../helpers/currencyHelper"
import { getConversionRate } from "../services/currencyService"

const handler: IMiddleware = ctx => {
  const _currencyFrom = ctx.request.query.currencyFrom
  const _currencyTo = ctx.request.query.currencyTo

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

  const conversion = getConversionRate(_currencyFrom, _currencyTo)
  switch (conversion) {
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
      ctx.body = { conversionRate: conversion.conversionRate }
      break
  }
}

export default handler
