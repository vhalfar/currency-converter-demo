import axios from "axios"
import { z } from "zod"
import { config } from "../config"

export async function getSymbols(): Promise<{ id: string; label: string }[]> {
  const response = await axios.get(config.urls.symbols)
  const schema = z.array(z.object({ id: z.string(), label: z.string() }))
  const data = schema.parse(response.data)
  return data
}

export async function getRate(
  symbolFrom: string,
  symbolTo: string
): Promise<{ conversionRate: number }> {
  const response = await axios.get(config.urls.rate, {
    params: {
      currencyFrom: symbolFrom,
      currencyTo: symbolTo,
    },
  })
  const schema = z.object({ conversionRate: z.number() })
  const data = schema.parse(response.data)
  return data
}

export async function getRates(symbolFrom: string): Promise<{ id: string; rate: number }[]> {
  const response = await axios.get(config.urls.rates, {
    params: {
      currencyFrom: symbolFrom,
    },
  })
  const schema = z.array(z.object({ id: z.string(), rate: z.number() }))
  const data = schema.parse(response.data)
  return data
}

export async function convert(
  symbolFrom: string,
  symbolTo: string,
  amount: number
): Promise<{ amountConverted: number; conversionRate: number }> {
  const response = await axios.post(config.urls.convert, {
    currencyFrom: symbolFrom,
    currencyTo: symbolTo,
    amount,
  })
  const schema = z.object({
    amountConverted: z.number(),
    conversionRate: z.number(),
  })
  const data = schema.parse(response.data)
  return data
}
