<script lang="ts">
  export let symbols: { id: string; label: string }[]
  export let symbol: { id: string; label: string } | undefined
  export let disabled = false
</script>

<select bind:value={symbol} on:change {disabled}>
  {#each symbols as s}
    <option value={s}>{s.id} - {s.label}</option>
  {/each}
</select>
