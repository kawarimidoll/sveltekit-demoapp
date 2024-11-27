<script lang='ts'>
  // https://daisyui.com/components/input/#text-input-with-icon-inside
  const { type = 'text', name, placeholder = '', icon } = $props();
</script>

<label class='flex items-center gap-2 input input-bordered'>
  {#if icon}
    <div class={icon}></div>
  {/if}
  <input {type} {name} {placeholder} class='grow bg-clip-text' />
</label>
