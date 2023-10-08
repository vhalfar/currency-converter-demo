export const config = {
  symbolFetchRetryInterval: 5000,
  rateFetchRetryInterval: 5000,
  currencyAmountAllowed: 1e7,
  wsConnectTimeout: 5000,
  numericPrecisionDigits: 3,
  baseCurrency: "USD",
  urls: {
    ws: "ws://localhost:3000",
    symbols: "http://localhost:3000/symbols",
    rate: "http://localhost:3000/rate",
    rates: "http://localhost:3000/rates",
    convert: "http://localhost:3000/convert",
  },
}
