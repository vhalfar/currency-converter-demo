<script lang="ts">
  import ConversionForm from "../components/ConversionForm.svelte"
  import Aside from "../components/Aside.svelte"
</script>

<div class="layout">
  <div class="layout-b"><ConversionForm /></div>
  <div class="layout-r"><Aside /></div>
</div>

<style>
  .layout {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    display: flex;
  }
  .layout > * {
    position: relative;
  }
  .layout-b {
    flex: 1;
    box-shadow: #666 0 0 16px 0;
  }
  .layout-r {
    width: 480px;
  }
</style>
