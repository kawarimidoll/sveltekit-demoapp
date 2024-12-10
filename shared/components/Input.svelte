<script lang='ts'>
  // https://daisyui.com/components/input/#text-input-with-icon-inside
  let { type = 'text', value = $bindable(), icon, ...attr } = $props();
</script>

<label class='flex items-center gap-2 input input-bordered'>
  {#if icon}
    <div class={icon}></div>
  {/if}
  <input {type} {...attr} bind:value class='grow bg-clip-text' />
</label>
