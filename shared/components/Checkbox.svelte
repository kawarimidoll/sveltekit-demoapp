<script lang='ts'>
  const { label, value = $bindable(), type = 'primary', name, ...attr } = $props();

  const className = `checkbox checkbox-${type}`;
</script>

<label class='cursor-pointer label'>
  <span class='label-text'>{label}</span>
  <input type='checkbox' class={className} name={name} {...attr} />
</label>
