<script lang='ts'>
  // TODO: classes should be more configurable
  // https://daisyui.com/components/dropdown/#method-2-using-css-focus
  const { trigger, main } = $props();
</script>

<div class='dropdown dropdown-end'>
  <div tabindex='0' role='button' class='m-1 btn btn-ghost'>
    {@render trigger()}
  </div>
  <div class='z-[1] w-26 rounded-box bg-base-100 p-2 shadow menu dropdown-content'>
    {@render main()}
  </div>
</div>
