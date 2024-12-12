<script lang='ts'>
  // https://daisyui.com/components/input/#text-input-with-icon-inside
  const { type = 'text', icon, ...attr } = $props();
</script>

<label class='flex items-center gap-2 input input-bordered'>
  {#if icon}
    <div class={icon}></div>
  {/if}
  <input {type} {...attr} class='grow bg-clip-text' />
</label>
