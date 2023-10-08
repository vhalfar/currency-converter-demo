<script lang="ts">
  import { ripple } from "../../actions/ripple"
</script>

<div use:ripple on:click>
  <slot />
</div>

<style>
  div {
    padding: 8px 12px;
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
  }
</style>
