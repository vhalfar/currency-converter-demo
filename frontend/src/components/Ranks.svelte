<script lang="ts">
  import { stats } from "../services/syncService"
  import type { SYMBOL } from "../services/memoryService"
  import { symbols, symbolsMap } from "../services/memoryService"
  import { getRates } from "../services/apiService"
  import { config } from "../config"
  import VerticalLayout from "./layout/VerticalLayout.svelte"
  import Center from "./layout/Center.svelte"
  import Label from "./ui/Label.svelte"
  import Range from "./ui/Range.svelte"
  import Loader from "./Loader.svelte"
  import CurrencySelector from "./CurrencySelector.svelte"
  import { normalize as N } from "../helpers/commonHelper"

  let direction: "source" | "target" = "source"
  let aggregator: "count" | "amount" = "count"

  $: list = Object.entries($stats ?? {})
    .map(([symbol, data]) => ({
      symbol,
      label: $symbolsMap?.[symbol]?.label ?? "",
      sourceCount: data.asSource.count,
      sourceAmount: data.asSource.amount,
      sourceAmountBase: rates ? data.asSource.amount / (rates[symbol] ?? NaN) : NaN,
      targetCount: data.asTarget.count,
      targetAmount: data.asTarget.amount,
      targetAmountBase: rates ? data.asTarget.amount / (rates[symbol] ?? NaN) : NaN,
    }))
    .sort((l, r) => selector(direction, aggregator, r) - selector(direction, aggregator, l))
    .filter(i => selector(direction, aggregator, i) !== 0)

  function selector(
    d: typeof direction,
    a: typeof aggregator,
    i: {
      sourceCount: number
      sourceAmountBase: number
      targetCount: number
      targetAmountBase: number
    }
  ): number {
    return d === "source"
      ? a === "count"
        ? i.sourceCount
        : i.sourceAmountBase
      : a === "count"
      ? i.targetCount
      : i.targetAmountBase
  }

  let rates: Record<string, number> | undefined = undefined
  let symbol: SYMBOL | undefined = undefined
  $: if ($symbolsMap && !symbol) {
    symbol = $symbolsMap[config.baseCurrency]
    loadBaseRates()
  }

  function loadBaseRates(): void {
    getRates(symbol?.id ?? config.baseCurrency)
      .then(response => (rates = Object.fromEntries(response.map(({ id, rate }) => [id, rate]))))
      .catch(() => setTimeout(loadBaseRates, config.symbolFetchRetryInterval))
  }

  function handleSymbolUpdate(): void {
    loadBaseRates()
  }
</script>

{#if $symbols}
  <VerticalLayout>
    <div slot="header" class="header">
      <select bind:value={direction}>
        <option value="source">Source</option>
        <option value="target">Target</option>
      </select>
      <select bind:value={aggregator}>
        <option value="count">Count</option>
        <option value="amount">Amount</option>
      </select>
      <CurrencySelector
        symbols={$symbols}
        bind:symbol
        on:change={handleSymbolUpdate}
        disabled={aggregator !== "amount"}
      />
    </div>
    {#if rates}
      {#each list as item}
        <div class="row">
          <Range
            base={selector(direction, aggregator, list[0])}
            part={selector(direction, aggregator, item)}
          />
          <div class="symbol">{item.symbol}</div>
          {#if aggregator === "count"}
            <div>|</div>
            <div>{N(selector(direction, aggregator, item))}</div>
          {/if}
          {#if aggregator === "amount"}
            {#if direction === "source"}
              <div>{N(item.sourceAmount)}</div>
            {/if}
            {#if direction === "target"}
              <div>{N(item.targetAmount)}</div>
            {/if}
            <div>|</div>
            <div>{N(selector(direction, aggregator, item))}</div>
          {/if}
        </div>
      {:else}
        <Center>
          <Label level="header">No stats available</Label>
          <Label level="description">Create new conversion</Label>
        </Center>
      {/each}
    {:else}
      <Loader />
    {/if}
  </VerticalLayout>
{:else}
  <Loader />
{/if}

<style>
  .header {
    display: flex;
    justify-content: center;
    padding: 12px 0 24px 0;
  }
  .row {
    display: flex;
    flex-direction: row-reverse;
    padding: 4px 8px;
    gap: 4px;
  }
  .symbol {
    font-weight: bold;
  }
</style>
