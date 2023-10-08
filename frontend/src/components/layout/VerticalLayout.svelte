<div class="grid">
  <div class="grid-h">
    <slot name="header" />
  </div>
  <div class="grid-b">
    <slot />
  </div>
  <div class="grid-f">
    <slot name="footer" />
  </div>
</div>

<style>
  .grid {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      "h"
      "b"
      "f";
  }
  .grid > * {
    position: relative;
  }
  .grid-h {
    grid-area: h;
  }
  .grid-b {
    grid-area: b;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .grid-f {
    grid-area: f;
  }
</style>
