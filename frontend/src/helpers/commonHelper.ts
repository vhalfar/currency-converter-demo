import { config } from "../config"

export function createSleepPromise(timeout: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export function convertTimestamp(timestamp: number, format: "D" | "T"): string {
  const date = new Date(timestamp)
  switch (format) {
    case "D":
      return `${date.getDate()}.${date.getMonth() + 1}.`
    case "T":
      const h = String(date.getHours()).padStart(2, "0")
      const m = String(date.getMinutes()).padStart(2, "0")
      return `${h}:${m}`
  }
}

export function normalize(num: number, precision = config.numericPrecisionDigits): number {
  if (num >= Math.pow(10, precision)) return Math.round(num)
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
}
