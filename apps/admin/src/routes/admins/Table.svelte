<script lang='ts'>
  const { thead, tbody } = $props();
</script>

<div class='overflow-x-auto'>
  <table class='table divide-y divide-gray-200 dark:divide-neutral-700'>
    <thead class=''>
      {@render thead()}
    </thead>
    <tbody class='divide-y divide-gray-200 dark:divide-neutral-700'>
      {@render tbody()}
    </tbody>
  </table>
</div>
