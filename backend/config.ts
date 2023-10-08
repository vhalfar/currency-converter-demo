const DEFAULT_STR = (v: string | undefined, d: string) => (v === undefined ? d : v)
const DEFAULT_NUM = (v: string | undefined, d: number) => (v === undefined ? d : Number(v))

export const config = {
  http: {
    port: DEFAULT_NUM(process.env.HTTP_PORT, 3000),
  },
  sql: {
    host: DEFAULT_STR(process.env.SQL_HOST, "127.0.0.1"),
    port: DEFAULT_NUM(process.env.SQL_PORT, 5432),
    user: DEFAULT_STR(process.env.SQL_USER, ""),
    pass: DEFAULT_STR(process.env.SQL_PASS, ""),
    db: DEFAULT_STR(process.env.SQL_DB, ""),
  },
  api: {
    fixer: {
      token: DEFAULT_STR(process.env.FIXER_ACCESS_TOKEN, ""),
    },
  },
  currencyAmountAllowed: 1e7,
  historyFetchRetryInterval: 5000,
  symbolFetchRetryInterval: 5000,
}
