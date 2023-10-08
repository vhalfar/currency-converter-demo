<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { config } from "../config"
  import ResetIcon from "./icons/resetIcon.svelte"
  import { ripple } from "../actions/ripple"

  export let value: number | undefined = 1
  export let disabled = false
  export let loading = false

  const limit = config.currencyAmountAllowed
  const dispatch = createEventDispatcher<{ change: void }>()

  $: isResetable = value !== 1 && value != null
  $: if (value === 0) value = undefined
  $: if (limit && value && value > limit) value = Math.floor(value / 10)

  function changeHandler(): void {
    setTimeout(() => dispatch("change"))
  }

  function resetHandler(): void {
    value = 1
    changeHandler()
  }
</script>

<div class="input-container">
  <input
    type="number"
    placeholder={loading ? "loading" : "unset"}
    {disabled}
    bind:value
    on:keyup={changeHandler}
  />
  <div class="reset" class:disabled={!isResetable} on:click={resetHandler} use:ripple>
    <ResetIcon />
  </div>
</div>

<style>
  input {
    border: solid 2px #ddd;
    border-radius: 8px;
    outline: none;
    margin: 0;
    padding: 0.5em;
    text-align: center;
    font-size: 1em;
    background-color: #eee;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
  input:focus {
    background-color: #ddd;
  }

  .input-container {
    position: relative;
  }
  .reset {
    position: absolute;
    left: 100%;
    top: 50%;
    padding: 4px;
    transform: translate(4px, -50%);
    cursor: pointer;
  }
  .reset:hover {
    color: red;
  }
  .reset.disabled {
    pointer-events: none;
    color: #bbb;
  }
</style>
