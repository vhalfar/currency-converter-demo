export function check(currency: any): currency is string {
  return typeof currency === "string" && /^[a-z]{3,3}$/i.test(currency)
}

export function normalize(currency: string): string {
  return currency.toUpperCase()
}
