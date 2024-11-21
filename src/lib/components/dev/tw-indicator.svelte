<script lang='ts'>
  // ref: https://github.com/svecosystem/mode-watcher/blob/main/sites/docs/src/lib/components/dev/tw-indicator.svelte
  // A simple indicator to show which breakpoint is active during development
  import { dev } from '$app/environment';
</script>

{#if dev}
  <div class='pointer-events-none fixed bottom-1 left-1 z-50 grid place-items-center rounded-full bg-gray-800 p-3 text-xs text-white font-mono opacity-60'>
    <div class='block sm:hidden'>xs</div>
    <div class='hidden sm:block md:hidden'>sm</div>
    <div class='hidden md:block lg:hidden'>md</div>
    <div class='hidden lg:block xl:hidden'>lg</div>
    <div class='hidden xl:block 2xl:hidden'>xl</div>
    <div class='hidden 2xl:block'>2xl</div>
  </div>
{/if}
