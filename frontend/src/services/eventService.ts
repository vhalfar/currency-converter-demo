export type EVENT_CONVERSION_SET = {
  symbolFrom: string
  symbolTo: string
  amountFrom: number
}

const onConversionSet = new Set<(args: EVENT_CONVERSION_SET) => void>()

export function setConversion(args: EVENT_CONVERSION_SET): void {
  onConversionSet.forEach(f => f(args))
}

export function registerConversionSet(hook: (args: EVENT_CONVERSION_SET) => void): void {
  onConversionSet.add(hook)
}

export function unregisterConversionSet(hook: (args: EVENT_CONVERSION_SET) => void): void {
  onConversionSet.delete(hook)
}
