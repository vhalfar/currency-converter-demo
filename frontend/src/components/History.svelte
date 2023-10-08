<script lang="ts">
  import { conversions, clearConversions } from "../services/memoryService"
  import VerticalLayout from "./layout/VerticalLayout.svelte"
  import Center from "./layout/Center.svelte"
  import Label from "./ui/Label.svelte"
  import Button from "./ui/Button.svelte"
  import HistoryConversion from "./HistoryConversion.svelte"
</script>

<VerticalLayout>
  {#each $conversions as conversion}
    <HistoryConversion {conversion} />
  {:else}
    <Center>
      <Label level="header">History is empty</Label>
      <Label level="description">Create new conversion</Label>
    </Center>
  {/each}
  <div slot="footer" class="footer">
    <Button on:click={clearConversions}>&#10007; Clear history</Button>
  </div>
</VerticalLayout>

<style>
  .footer {
    display: flex;
    flex-flow: row-reverse;
  }
</style>
