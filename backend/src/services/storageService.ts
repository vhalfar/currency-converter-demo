import postgres from "postgres"
import { config } from "../../config"

type CONVERSION_RECORD = {
  currencyFrom: string
  currencyTo: string
  amountFrom: number
  amountTo: number
}

const sql = postgres({
  host: config.sql.host,
  port: config.sql.port,
  username: config.sql.user,
  password: config.sql.pass,
  database: config.sql.db,
})

export async function getConversions(): Promise<CONVERSION_RECORD[]> {
  const result =
    await sql`SELECT currency_from,currency_to,amount_from,amount_to FROM public.conversion`
  return result.map(row => ({
    currencyFrom: row.currency_from,
    currencyTo: row.currency_to,
    amountFrom: row.amount_from,
    amountTo: row.amount_to,
  }))
}

export async function storeConversion({
  currencyFrom,
  currencyTo,
  amountFrom,
  amountTo,
}: CONVERSION_RECORD): Promise<void> {
  await sql`INSERT INTO public.conversion(currency_from,currency_to,amount_from,amount_to,conversion_rate) VALUES( ${currencyFrom},${currencyTo},${amountFrom},${amountTo},${
    amountTo / amountFrom
  } )`
}
