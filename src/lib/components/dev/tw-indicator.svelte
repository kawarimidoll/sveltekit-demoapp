<script lang='ts'>
  // ref: https://github.com/svecosystem/mode-watcher/blob/main/sites/docs/src/lib/components/dev/tw-indicator.svelte
  // A simple indicator to show which breakpoint is active during development
  import { dev } from '$app/environment';
</script>

{#if dev}
  <div class='pointer-events-none font-mono badge badge-accent'>
    <span class='inline-block sm:hidden'>xs</span>
    <span class='hidden sm:inline-block md:hidden'>sm</span>
    <span class='hidden md:inline-block lg:hidden'>md</span>
    <span class='hidden lg:inline-block xl:hidden'>lg</span>
    <span class='hidden xl:inline-block 2xl:hidden'>xl</span>
    <span class='hidden 2xl:inline-block'>2xl</span>
  </div>
{/if}
