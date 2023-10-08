export type CURRENCY_STATS_ITEMS = {
  [key: string]: CURRENCY_STATS_ITEM
}

type CURRENCY_STATS_ITEM = {
  asSource: { amount: number; count: number }
  asTarget: { amount: number; count: number }
}

type CURRENCY_STATS_DELTA = {
  source: { currency: string; amount: number }
  target: { currency: string; amount: number }
}

const wrapStatsInit = (data: any) => ({ op: "stats.init", data })
const wrapStatsSync = (data: any) => ({ op: "stats.sync", data })

const syncHooks = new Set<(data: any) => void>()
let syncStats: CURRENCY_STATS_ITEMS | undefined = undefined

export function registerSyncHook(hook: (data: any) => void): void {
  if (syncStats) {
    hook(wrapStatsInit(syncStats))
  }
  syncHooks.add(hook)
}

export function unregisterSyncHook(hook: (data: any) => void): void {
  syncHooks.delete(hook)
}

export function emitStatsInit(stats: CURRENCY_STATS_ITEMS): void {
  syncStats = stats
  syncHooks.forEach(hook => hook(wrapStatsInit(stats)))
}

export function emitStatsUpdate(statsDelta: CURRENCY_STATS_DELTA): void {
  if (syncStats) {
    const sourceCurrency = statsDelta.source.currency
    let sourceStats = syncStats[sourceCurrency]
    if (!sourceStats) {
      sourceStats = syncStats[sourceCurrency] = {
        asSource: { amount: 0, count: 0 },
        asTarget: { amount: 0, count: 0 },
      }
    }
    sourceStats.asSource.amount += statsDelta.source.amount
    sourceStats.asSource.count++

    const targetCurrency = statsDelta.target.currency
    let targetStats = syncStats[targetCurrency]
    if (!targetStats) {
      targetStats = syncStats[targetCurrency] = {
        asSource: { amount: 0, count: 0 },
        asTarget: { amount: 0, count: 0 },
      }
    }
    targetStats.asTarget.amount += statsDelta.target.amount
    targetStats.asTarget.count++

    syncHooks.forEach(hook =>
      hook(
        wrapStatsSync({
          ...(sourceStats ? { [sourceCurrency]: { asSource: sourceStats.asSource } } : {}),
          ...(targetStats ? { [targetCurrency]: { asTarget: targetStats.asTarget } } : {}),
        })
      )
    )
  }
}
