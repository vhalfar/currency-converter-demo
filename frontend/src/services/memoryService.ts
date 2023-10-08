import { z } from "zod"
import { writable, get, derived } from "svelte/store"
import { config } from "../config"
import * as commonHelper from "../helpers/commonHelper"
import * as apiService from "./apiService"

export type CONVERSION = {
  symbolFrom: string
  symbolTo: string
  amountFrom: number
  amountTo: number
  time: number
}

export type SYMBOL = {
  id: string
  label: string
}

export const conversions = writable<CONVERSION[]>([])
export const symbols = writable<SYMBOL[] | undefined>(undefined)
export const symbolsMap = derived(symbols, data =>
  data ? Object.fromEntries(data.map(s => [s.id, s])) : undefined
)

const BROADCAST_CHANNEL = "convertor"
const BROADCAST_EV_CONVERSIONS_UPDATE = "conversions.update"
const STORAGE_CONVERSIONS_KEY = "conversions"

export function insertConversion(conversion: CONVERSION): void {
  conversions.set([conversion, ...get(conversions)])
  onConversionsUpdate()
}

export function clearConversions(): void {
  conversions.set([])
  onConversionsUpdate()
}

function onConversionsUpdate(): void {
  storeConversions()
  sendBroadcast(BROADCAST_EV_CONVERSIONS_UPDATE)
}

async function init() {
  console.log("[syncService::init] Fetching symbols...")
  while (true) {
    try {
      const response = await apiService.getSymbols()
      symbols.set(response)
      break
    } catch (e) {
      await commonHelper.createSleepPromise(config.symbolFetchRetryInterval)
    }
  }

  console.log("[syncService::init] Success")
}
init().catch(() => console.error("syncService: unexpected failure"))

function loadConversions(): void {
  if (typeof window !== "undefined") {
    const data = window?.localStorage?.getItem(STORAGE_CONVERSIONS_KEY) ?? "[]"
    try {
      conversions.set(
        z
          .array(
            z.object({
              symbolFrom: z.string(),
              symbolTo: z.string(),
              amountFrom: z.number(),
              amountTo: z.number(),
              time: z.number(),
            })
          )
          .parse(JSON.parse(data))
      )
    } catch (e) {
      console.error(e)
      console.error("memoryService: Conversions load failed")
    }
  }
}

function storeConversions(): void {
  if (typeof window !== "undefined") {
    window?.localStorage?.setItem(STORAGE_CONVERSIONS_KEY, JSON.stringify(get(conversions)))
  }
}

let sendBroadcast = (data: any) => {}
const onBroadcast = (data: any) => {
  if (data === BROADCAST_EV_CONVERSIONS_UPDATE) loadConversions()
}
if (typeof window !== "undefined") {
  if (window.BroadcastChannel) {
    const channel = new window.BroadcastChannel(BROADCAST_CHANNEL)
    sendBroadcast = (data: any) => channel.postMessage(data)
    channel.onmessage = ev => onBroadcast(ev.data)
  }
}

loadConversions()
