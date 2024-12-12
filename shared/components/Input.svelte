<script lang='ts'>
  // https://daisyui.com/components/input/#text-input-with-icon-inside
  let { type = 'text', value = $bindable(), icon = '', wrapperClass = '', ...attr } = $props();

  // TODO: merge tailwind classes
  wrapperClass = [
    'flex items-center gap-2 input input-bordered',
    wrapperClass,
  ].join(' ');
</script>

<label class={wrapperClass}>
  {#if icon}
    <div class={icon}></div>
  {/if}
  <input {type} {...attr} bind:value class='grow bg-clip-text' />
</label>
