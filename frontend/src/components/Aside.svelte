<script lang="ts">
  import History from "./History.svelte"
  import Ranks from "./Ranks.svelte"
  import Stats from "./Stats.svelte"
  import Tab from "./ui/Tab.svelte"
  import VerticalLayout from "./layout/VerticalLayout.svelte"

  let tab: "history" | "ranks" | "stats" = "history"
</script>

<VerticalLayout>
  <div slot="header" class="header">
    <Tab label="History" active={tab === "history"} on:click={() => (tab = "history")} />
    <Tab label="Ranks" active={tab === "ranks"} on:click={() => (tab = "ranks")} />
    <Tab label="Stats" active={tab === "stats"} on:click={() => (tab = "stats")} />
  </div>
  {#if tab === "history"}
    <History />
  {:else if tab === "ranks"}
    <Ranks />
  {:else if tab === "stats"}
    <Stats />
  {/if}
</VerticalLayout>

<style>
  .header {
    display: flex;
    justify-content: center;
    background-color: #00000010;
  }
</style>
