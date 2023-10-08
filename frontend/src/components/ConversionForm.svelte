<script lang="ts">
  import { onMount } from "svelte"
  import { normalize as N } from "../helpers/commonHelper"
  import { getRate, convert } from "../services/apiService"
  import type { SYMBOL } from "../services/memoryService"
  import { insertConversion, symbols, symbolsMap } from "../services/memoryService"
  import CurrencyInput from "./CurrencyInput.svelte"
  import CurrencySelector from "./CurrencySelector.svelte"
  import Loader from "./Loader.svelte"
  import {
    registerConversionSet,
    unregisterConversionSet,
    type EVENT_CONVERSION_SET,
  } from "../services/eventService"
  import { config } from "../config"
  import SwapIcon from "./icons/swapIcon.svelte"
  import { ripple } from "../actions/ripple"
  import ConversionButton from "./ConversionButton.svelte"

  let symbolFrom: SYMBOL | undefined = undefined
  let symbolTo: SYMBOL | undefined = undefined
  let amountFrom: number | undefined = undefined
  let amountTo: number | undefined = undefined
  let ratio: number | undefined = 1
  let convertPromise: Promise<void> | undefined = undefined
  $: conversionAllowed = symbolFrom && symbolTo && symbolFrom.id !== symbolTo.id && ratio

  const handleSymbolUpdate = () => {
    if (symbolFrom && symbolTo) {
      const sfid = symbolFrom.id
      const stid = symbolTo.id
      ratio = undefined
      amountTo = undefined
      getRate(sfid, stid)
        .then(response => {
          if (sfid === symbolFrom?.id && stid === symbolTo?.id) {
            ratio = response.conversionRate
            handleAmountFromUpdate()
          }
        })
        .catch(() => {
          setTimeout(() => {
            if (sfid === symbolFrom?.id && stid === symbolTo?.id) {
              handleSymbolUpdate()
            }
          }, config.rateFetchRetryInterval)
        })
    }
  }
  const handleAmountFromUpdate = () => {
    if (ratio) amountTo = amountFrom ? N(amountFrom * ratio) : undefined
  }
  const handleAmountToUpdate = () => {
    if (ratio) amountFrom = amountTo ? N(amountTo / ratio) : undefined
  }
  const swapSymbols = () => {
    if (symbolFrom?.id !== symbolTo?.id) {
      ;[symbolFrom, symbolTo] = [symbolTo, symbolFrom]
      amountFrom = amountTo
      handleSymbolUpdate()
    }
  }
  const convertSymbols = () => {
    const sf = symbolFrom
    const st = symbolTo
    const af = amountFrom
    if (sf && st && af)
      convertPromise = convert(sf.id, st.id, af)
        .then(response => {
          insertConversion({
            symbolFrom: sf.id,
            symbolTo: st.id,
            amountFrom: af,
            amountTo: N(response.amountConverted),
            time: new Date().getTime(),
          })
        })
        .catch(e => {
          console.error("Conversion failed", e)
        })
  }

  onMount(() => {
    const conversionSetHook = (event: EVENT_CONVERSION_SET) => {
      symbolFrom = $symbolsMap?.[event.symbolFrom]
      symbolTo = $symbolsMap?.[event.symbolTo]
      amountFrom = event.amountFrom
      handleSymbolUpdate()
    }
    registerConversionSet(conversionSetHook)
    return () => unregisterConversionSet(conversionSetHook)
  })
</script>

<div class="form">
  {#if !$symbols}
    <Loader />
  {:else}
    <CurrencySelector symbols={$symbols} bind:symbol={symbolFrom} on:change={handleSymbolUpdate} />
    <div class="row">
      <CurrencyInput bind:value={amountFrom} on:change={handleAmountFromUpdate} />
    </div>
    <div class="swap">
      <div class="swap-icon" on:click={swapSymbols} use:ripple>
        <SwapIcon />
      </div>
      <div class="swap-ratio">
        {#if !ratio}
          <div style="opacity:0.6">loading</div>
        {:else}
          &#215;{N(ratio)}
        {/if}
      </div>
    </div>
    <CurrencyInput
      bind:value={amountTo}
      on:change={handleAmountToUpdate}
      disabled={!ratio}
      loading={!ratio}
    />
    <CurrencySelector symbols={$symbols} bind:symbol={symbolTo} on:change={handleSymbolUpdate} />
    <div />
    <ConversionButton
      promise={convertPromise}
      on:click={convertSymbols}
      disabled={!conversionAllowed}
    />
  {/if}
</div>

<style>
  .form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .swap {
    position: relative;
  }
  .swap-icon {
    cursor: pointer;
  }
  .swap-ratio {
    position: absolute;
    left: 50px;
    top: 50%;
    transform: translateY(-50%);
    padding: 4px 8px;
    border-radius: 8px;
    border: solid 2px #ddd;
    background-color: #eee;
    cursor: not-allowed;
  }
</style>
