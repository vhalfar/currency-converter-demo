<script lang="ts">
  export let base: number | undefined
  export let part: number | undefined

  $: range = base && part ? part / base : 0

  const WIDTH = 200
</script>

<div style="width:{range * WIDTH}px" />

<style>
  div {
    height: 16px;
    background-color: #ff000030;
    border-left: solid 4px red;
  }
</style>
