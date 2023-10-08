import * as z from "zod"
import { writable } from "svelte/store"
import { config } from "../config"

type SYNC_MEMORY = {
  [symbol: string]: {
    asSource: { amount: number; count: number }
    asTarget: { amount: number; count: number }
  }
}

export const websocket = writable<WebSocket | undefined>(undefined)
export const stats = writable<SYNC_MEMORY | undefined>(undefined)

function createConnection(): Promise<WebSocket> {
  return new Promise<WebSocket>((resolve, reject) => {
    let ws: WebSocket = new WebSocket(config.urls.ws)
    let timer = setTimeout(() => {
      ws.onerror = null
      ws.close()
      reject()
    }, config.wsConnectTimeout)
    ws.onopen = () => {
      clearTimeout(timer)
      ws.onerror = null
      resolve(ws)
    }
    ws.onerror = e => {
      clearTimeout(timer)
      ws.onerror = null
      ws.close()
      reject(e)
    }
  })
}

function connect(): void {
  createConnection()
    .then(c => {
      c.onmessage = o => {
        onMessageHandler(o.data as unknown)
      }
      c.onclose = () => {
        websocket.set(undefined)
        setTimeout(connect, config.wsConnectTimeout)
      }
      websocket.set(c)
    })
    .catch(() => {
      setTimeout(connect, config.wsConnectTimeout)
    })
}

function onMessageHandler(data: unknown): void {
  try {
    if (typeof data === "string") data = JSON.parse(data)
  } catch (e) {}

  const asSourceOrTargetSchema = z.object({
    amount: z.number(),
    count: z.number(),
  })
  const schemaStatsInit = z.object({
    op: z.literal("stats.init"),
    data: z.record(
      z.object({
        asSource: asSourceOrTargetSchema,
        asTarget: asSourceOrTargetSchema,
      })
    ),
  })
  const schemaStatsSync = z.object({
    op: z.literal("stats.sync"),
    data: z.record(
      z.object({
        asSource: asSourceOrTargetSchema.optional(),
        asTarget: asSourceOrTargetSchema.optional(),
      })
    ),
  })

  z.union([schemaStatsInit, schemaStatsSync])
    .parseAsync(data)
    .then(data => {
      switch (data.op) {
        case "stats.init":
          stats.set(data.data)
          break
        case "stats.sync":
          stats.update(memory => {
            memory = memory ?? {}
            for (const [symbol, sync] of Object.entries(data.data)) {
              memory[symbol] = memory[symbol] = {
                asSource: { amount: 0, count: 0 },
                asTarget: { amount: 0, count: 0 },
              }
              if (sync.asSource) memory[symbol].asSource = sync.asSource
              if (sync.asTarget) memory[symbol].asTarget = sync.asTarget
            }
            return memory
          })
          break
        default:
          console.error("syncService: Websocket message unexpected body ")
          break
      }
    })
    .catch(() => {
      console.error("syncService: Websocket message unexpected format")
    })
}

connect()
