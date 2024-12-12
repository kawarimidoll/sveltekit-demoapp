<script lang='ts'>
  // https://daisyui.com/components/select/#select-with-border
  let { placeholder = '', label, value = $bindable(), options, ...attr } = $props();

  if (!value) {
    value = options?.at(0);
  }
</script>

<label class='form-control w-full max-w-xs'>
  {#if label}
    <div class='label'>
      <span class='label-text'>{label}</span>
    </div>
  {/if}
  <select class='select select-bordered w-full max-w-xs' bind:value {...attr}>
    {#if placeholder}
      <option disabled>{placeholder}</option>
    {/if}
    {#each options as option}
      <option>{option}</option>
    {/each}
  </select>
</label>
