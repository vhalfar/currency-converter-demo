<script lang="ts">
  import { ripple } from "../../actions/ripple"

  export let label: string
  export let active: boolean
</script>

<div use:ripple>
  <div class="button" class:active on:click>{label}</div>
</div>

<style>
  .button {
    padding: 8px 12px;
    border-bottom: solid 4px transparent;
    white-space: nowrap;
    cursor: pointer;
  }
  .button.active {
    border-bottom-color: red;
    background-color: #00000010;
  }
</style>
