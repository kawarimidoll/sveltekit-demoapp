<script lang='ts'>
  // https://daisyui.com/components/dropdown/#method-2-using-css-focus
  // TODO: use class merge
  const { trigger, main, wrapperClass = '', triggerClass = '', mainClass = '' } = $props();
</script>

<div class={`dropdown dropdown-end ${wrapperClass}`}>
  <div tabindex='0' role='button' class={`m-1 btn btn-ghost ${triggerClass}`}>
    {@render trigger()}
  </div>
  <div class={`z-[1] w-26 rounded-box bg-base-100 p-2 shadow menu dropdown-content ${mainClass}`}>
    {@render main()}
  </div>
</div>
