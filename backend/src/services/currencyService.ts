import { config } from "../../config"
import * as commonHelper from "../helpers/commonHelper"
import * as currencyHelper from "../helpers/currencyHelper"
import * as eventService from "./eventService"
import * as fetchService from "./fetchService"
import * as storageService from "./storageService"

type SYMBOLS_RESPONSE = {
  id: string
  label: string
}[]

type CONVERSION_RATE_RESPONSE = {
  conversionRate: number
}

type CONVERSION_RATES_RESPONSE = {
  id: string
  rate: number
}[]

type CONVERT_RESPONSE = {
  amountConverted: number
  conversionRate: number
}

let symbols: undefined | Record<string, { id: string; label: string }> = undefined
let rates: undefined | { base: string; rates: Record<string, number> } = undefined

export function isInitialized(): boolean {
  return !!symbols && !!rates
}

export function getSymbols(): SYMBOLS_RESPONSE | "E_MEMORY_NOT_INITIALIZED" {
  if (!symbols) {
    return "E_MEMORY_NOT_INITIALIZED"
  }
  return Object.values(symbols)
}

export function getConversionRate(
  currencyFrom: string,
  currencyTo: string
): CONVERSION_RATE_RESPONSE | "E_MEMORY_NOT_INITIALIZED" | "E_CONVERSION_NOT_FOUND" {
  if (!symbols) {
    return "E_MEMORY_NOT_INITIALIZED"
  }
  if (!rates) {
    return "E_MEMORY_NOT_INITIALIZED"
  }

  currencyFrom = currencyHelper.normalize(currencyFrom)
  currencyTo = currencyHelper.normalize(currencyTo)

  const rateToBase: number | undefined = currencyFrom === rates.base ? 1 : rates.rates[currencyFrom]
  const rateFromBase: number | undefined = currencyTo === rates.base ? 1 : rates.rates[currencyTo]

  if (rateToBase === undefined || rateFromBase === undefined) {
    return "E_CONVERSION_NOT_FOUND"
  }

  return { conversionRate: (1 / rateToBase) * rateFromBase }
}

export function getConversionRates(
  currencyFrom: string
): CONVERSION_RATES_RESPONSE | "E_MEMORY_NOT_INITIALIZED" | "E_CURRENCY_NOT_FOUND" {
  if (!symbols) {
    return "E_MEMORY_NOT_INITIALIZED"
  }
  if (!rates) {
    return "E_MEMORY_NOT_INITIALIZED"
  }

  currencyFrom = currencyHelper.normalize(currencyFrom)
  const rateToBase = rates.rates[currencyFrom]
  if (!rateToBase) {
    return "E_CURRENCY_NOT_FOUND"
  }

  return Object.entries(rates.rates).map(([id, rate]) => ({
    id,
    rate: (1 / rateToBase) * rate,
  }))
}

export async function convert(
  currencyFrom: string,
  currencyTo: string,
  amount: number
): Promise<CONVERT_RESPONSE | "E_MEMORY_NOT_INITIALIZED" | "E_CONVERSION_NOT_FOUND"> {
  currencyFrom = currencyHelper.normalize(currencyFrom)
  currencyTo = currencyHelper.normalize(currencyTo)

  const conversion = getConversionRate(currencyFrom, currencyTo)
  switch (conversion) {
    case "E_MEMORY_NOT_INITIALIZED":
      return conversion
    case "E_CONVERSION_NOT_FOUND":
      return conversion
  }

  const conversionRate = conversion.conversionRate
  const amountConverted = amount * conversionRate

  await storageService.storeConversion({
    currencyFrom: currencyFrom,
    currencyTo: currencyTo,
    amountFrom: amount,
    amountTo: amountConverted,
  })

  eventService.emitStatsUpdate({
    source: { currency: currencyFrom, amount },
    target: { currency: currencyTo, amount: amountConverted },
  })

  return {
    amountConverted,
    conversionRate,
  }
}

export function initialize(): void {
  const handler = async () => {
    // Fetch symbols
    console.log("[currencyService::init] Fetching symbols...")
    while (true) {
      try {
        const response = await fetchService.getSymbols()
        symbols = Object.fromEntries(
          response.map(symbol => [currencyHelper.normalize(symbol.id), symbol])
        )
        break
      } catch (e) {
        await commonHelper.createSleepPromise(config.symbolFetchRetryInterval)
      }
    }

    // Fetch conversion rates
    console.log("[currencyService::init] Fetching currency rates...")
    while (true) {
      try {
        const response = await fetchService.getRates()
        rates = {
          base: response.base,
          rates: Object.fromEntries(
            Object.entries(response.rates).map(([id, rate]) => [currencyHelper.normalize(id), rate])
          ),
        }
        break
      } catch (e) {
        await commonHelper.createSleepPromise(config.symbolFetchRetryInterval)
      }
    }

    // Fetch conversion history
    console.log("[currencyService::init] Fetching conversion history...")
    while (true) {
      try {
        const tmp: eventService.CURRENCY_STATS_ITEMS = {}
        for (const item of await storageService.getConversions()) {
          const cf = currencyHelper.normalize(item.currencyFrom)
          const ct = currencyHelper.normalize(item.currencyTo)

          tmp[cf] = tmp[cf] ?? {
            asSource: { amount: 0, count: 0 },
            asTarget: { amount: 0, count: 0 },
          }
          tmp[cf].asSource.amount += item.amountFrom
          tmp[cf].asSource.count++

          tmp[ct] = tmp[ct] ?? {
            asSource: { amount: 0, count: 0 },
            asTarget: { amount: 0, count: 0 },
          }
          tmp[ct].asTarget.amount += item.amountTo
          tmp[ct].asTarget.count++

          eventService.emitStatsInit(tmp)
        }
        break
      } catch (e) {
        await commonHelper.createSleepPromise(config.historyFetchRetryInterval)
      }
    }

    console.log("[currencyService::init] Success")
  }
  handler().catch(() => console.error("currencyService: unexpected failure"))
}
