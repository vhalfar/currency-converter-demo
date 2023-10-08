import axios from "axios"
import { z } from "zod"
import { config } from "../../config"

const URL_SYMBOLS = "http://data.fixer.io/api/symbols"
const URL_RATES = "http://data.fixer.io/api/latest"

export async function getSymbols(): Promise<{ id: string; label: string }[]> {
  const response = await axios.get(URL_SYMBOLS, {
    params: { access_key: config.api.fixer.token },
  })
  const schema = z.object({
    success: z.literal(true),
    symbols: z.record(z.string()),
  })
  const data = schema.parse(response.data)
  return Object.entries(data.symbols).map(([id, label]) => ({ id, label }))
}

export async function getRates(): Promise<{
  base: string
  rates: Record<string, number>
}> {
  const response = await axios.get(URL_RATES, {
    params: { access_key: config.api.fixer.token },
  })
  const schema = z.object({
    success: z.literal(true),
    base: z.string(),
    rates: z.record(z.number()),
  })
  const data = schema.parse(response.data)
  return { base: data.base, rates: data.rates }
}
