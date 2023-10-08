<script lang="ts">
  export let level: "header" | "description"
</script>

<div class={level}>
  <slot />
</div>

<style>
  div {
    white-space: nowrap;
    text-align: center;
    margin: 4px;
  }
  div.header {
    font-size: 1.5em;
  }
  div.description {
    font-size: 0.8em;
  }
</style>
