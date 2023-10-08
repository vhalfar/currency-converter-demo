<script lang="ts">
  import { config } from "../config"
  import { normalize as N } from "../helpers/commonHelper"
  import { getRates } from "../services/apiService"
  import { symbols } from "../services/memoryService"
  import { stats } from "../services/syncService"
  import Loader from "./Loader.svelte"
  import VerticalLayout from "./layout/VerticalLayout.svelte"

  let rates = getRates(config.baseCurrency)
</script>

{#if $symbols && $stats}
  <VerticalLayout>
    <div class="row">
      <div class="item">
        <div>Total symbols available</div>
        <div>{$symbols.length}</div>
      </div>
      <div class="item">
        <div>Converted symbols</div>
        <div>{Object.keys($stats).length}</div>
      </div>
    </div>
    <div class="row">
      <div class="item">
        <div>Total conversions count</div>
        <div>
          {Object.values($stats).reduce((a, v) => a + v.asSource.count, 0)}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="item">
        <div>Favorite source symbol</div>
        <div>
          {Object.entries($stats)
            .map(([k, v]) => ({ k, v: v.asSource.count }))
            .sort((l, r) => r.v - l.v)[0].k}
        </div>
      </div>
      <div class="item">
        <div>Favorite target symbol</div>
        <div>
          {Object.entries($stats)
            .map(([k, v]) => ({ k, v: v.asTarget.count }))
            .sort((l, r) => r.v - l.v)[0].k}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="item">
        <div>Total amount converted</div>
        <div>
          {#await rates}
            Loading...
          {:then _rates}
            {N(
              Object.entries($stats)
                .map(([k, v]) => ({
                  k,
                  v: v.asSource.amount / (_rates?.find(v => v.id === k)?.rate || NaN),
                }))
                .reduce((a, v) => a + v.v, 0)
            )}&nbsp;{config.baseCurrency}
          {:catch _error}
            <div on:click={() => (rates = getRates(config.baseCurrency))}>
              ERROR! Click to retry
            </div>
          {/await}
        </div>
      </div>
    </div>
  </VerticalLayout>
{:else}
  <Loader />
{/if}

<style>
  .row {
    display: flex;
    margin: 8px 8px 8px 12px;
    gap: 8px;
  }
  .item {
    flex: 1;
    padding: 8px;
    background-color: #00000010;
    border-radius: 8px;
  }
  .item > div:first-child {
    font-weight: bold;
    font-size: 14px;
  }
  .item > div:last-child {
    text-align: right;
  }
</style>
