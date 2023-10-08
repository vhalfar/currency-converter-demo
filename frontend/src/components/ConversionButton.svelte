<script lang="ts">
  import { ripple } from "../actions/ripple"

  export let promise: Promise<void> | undefined = undefined
  export let disabled: boolean

  $: if (disabled) promise = undefined
</script>

<div class="button-container">
  {#if !promise}
    <div class="button" class:disabled use:ripple on:click>Convert</div>
  {:else}
    {#await promise}
      <div class="button">Converting...</div>
    {:then _result}
      <div class="button" on:click use:ripple>Convert</div>
    {:catch _error}
      <div class="button" on:click use:ripple>Convert</div>
    {/await}
  {/if}

  {#if promise}
    {#await promise then _result}
      <div class="result success" on:click={() => (promise = undefined)}>
        Conversion successful!<span class="result-close-icon">&#10003;</span>
      </div>
    {:catch _error}
      <div class="result error" on:click={() => (promise = undefined)}>
        Conversion error!<span class="result-close-icon">&#10007;</span>
      </div>
    {/await}
  {/if}
</div>

<style>
  .button-container {
    position: relative;
  }
  .button {
    padding: 8px 24px;
    border-radius: 8px;
    border: solid 2px red;
    background-color: #ffe0e0;
    font-weight: bold;
    font-size: 14px;
    text-transform: uppercase;
    cursor: pointer;
  }
  .button.disabled {
    pointer-events: none;
    opacity: 0.3;
  }
  .result {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 8px);
    border: solid 2px transparent;
    border-radius: 8px;
    white-space: nowrap;
    padding: 8px;
    cursor: pointer;
  }
  .result.success {
    border-color: lime;
    background-color: #00ff142b;
  }
  .result.error {
    border-color: red;
    background-color: #ff00002b;
  }
  .result-close-icon {
    padding-left: 8px;
    font-weight: bold;
  }
</style>
