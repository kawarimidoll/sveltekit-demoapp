<script lang='ts'>
  // https://daisyui.com/components/tab/#radio-tab-bordered--tab-content
  const { name, tabs, initialChecked = '', ...attr } = $props();
  const initial = initialChecked || tabs[0].value;

  $inspect({ name, tabs, initialChecked, initial });
</script>

<div role='tablist' class='tabs tabs-bordered'>

  {#each tabs as { label, value }}
    <input type='radio'
           {name}
           role='tab'
           class='tab'
           aria-label={label}
           {value}
           {...attr}
           checked={value === initial} />
  {/each}

</div>
