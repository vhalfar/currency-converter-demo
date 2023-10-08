<script lang="ts">
  import { normalize as N, convertTimestamp } from "../helpers/commonHelper"
  import type { CONVERSION } from "../services/memoryService"
  import { setConversion } from "../services/eventService"
  import { ripple } from "../actions/ripple"

  export let conversion: CONVERSION
</script>

<div class="conversion" use:ripple on:click={() => setConversion(conversion)}>
  <div class="conversion-symbol">
    {conversion.symbolFrom}&nbsp;&#10132;&nbsp;{conversion.symbolTo}
  </div>
  <div style="flex:1" />
  <div class="conversion-description">
    {N(conversion.amountFrom)}&nbsp;{conversion.symbolFrom}
    &#10132;
    {N(conversion.amountTo)}&nbsp;{conversion.symbolTo}
  </div>
  <div style="flex:1" />
  <div>
    {convertTimestamp(conversion.time, "D")}
    {convertTimestamp(conversion.time, "T")}
  </div>
</div>

<style>
  .conversion {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    margin: 12px 8px 12px 16px;
    padding: 12px;
    background-color: #00000010;
    border-left: solid 4px transparent;
    cursor: pointer;
  }
  .conversion:hover {
    border-left-color: red;
  }
  .conversion-symbol {
    font-weight: bold;
  }
  .conversion-description {
    font-size: 0.8em;
  }
</style>
